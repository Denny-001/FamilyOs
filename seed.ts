/**
 * FamilyOS — Database Seed Script
 *
 * Populates MongoDB with a realistic dev dataset:
 *   • 6 users (1 owner, 1 admin, 2 adults, 1 minor, 1 guest)
 *   • 1 family ("The Mwangi Family")
 *   • 1 upcoming event with contributions
 *   • 2 tasks, 3 feed posts, 1 announcement
 *
 * Usage:
 *   npm run seed            # idempotent — skips if seed data exists
 *   npm run seed:reset      # wipes seed data first, then reseeds
 *
 * Dev credentials (password for all):  Password123!
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Resolve env from repo root .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Reuse the server's models — no duplicated schemas.
import { User } from '../server/src/models/User';
import { Family } from '../server/src/models/Family';
import { FamilyMembership } from '../server/src/models/FamilyMembership';
import { Event } from '../server/src/models/Event';
import { RSVP } from '../server/src/models/RSVP';
import { Task } from '../server/src/models/Task';
import { Post } from '../server/src/models/Post';
import { Contribution } from '../server/src/models/Contribution';
import { Invitation } from '../server/src/models/Invitation';

const RESET = process.argv.includes('--reset');
const SEED_TAG = 'seed:familyos:v1'; // marker so cleanup knows what to remove
const DEMO_PASSWORD = 'Password123!';

const log = {
  info: (m: string) => console.log(`\x1b[36m[seed]\x1b[0m ${m}`),
  ok: (m: string) => console.log(`\x1b[32m[seed] ✓\x1b[0m ${m}`),
  warn: (m: string) => console.log(`\x1b[33m[seed] !\x1b[0m ${m}`),
  err: (m: string) => console.error(`\x1b[31m[seed] ✗\x1b[0m ${m}`),
};

async function connect(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing — copy .env.example → .env first');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  log.ok(`Connected to ${mongoose.connection.host}`);
}

async function wipeSeedData(): Promise<void> {
  log.warn('Resetting seed data…');
  const family = await Family.findOne({ slug: 'the-mwangi-family' });
  if (!family) {
    log.info('No existing seed family found.');
    return;
  }

  await Promise.all([
    Post.deleteMany({ familyId: family._id }),
    Event.deleteMany({ familyId: family._id }),
    Task.deleteMany({ familyId: family._id }),
    Contribution.deleteMany({ familyId: family._id }),
    Invitation.deleteMany({ familyId: family._id }),
    RSVP.deleteMany({}).where('eventId').in(await Event.find({ familyId: family._id }).distinct('_id')),
    FamilyMembership.deleteMany({ familyId: family._id }),
  ]);

  const seedPhones = [
    '+254700000001', '+254700000002', '+254700000003',
    '+254700000004', '+254700000005', '+254700000006',
  ];
  await User.deleteMany({ phone: { $in: seedPhones } });
  await family.deleteOne();
  log.ok('Seed data cleared.');
}

interface SeedUser {
  name: string;
  phone: string;
  email?: string;
  role: 'owner' | 'admin' | 'adult' | 'minor' | 'guest';
  relationship: string;
  dateOfBirth?: Date;
}

const SEED_USERS: SeedUser[] = [
  { name: 'Grace Mwangi',  phone: '+254700000001', email: 'grace@familyos.dev',  role: 'owner', relationship: 'Founder',         dateOfBirth: new Date('1972-03-14') },
  { name: 'David Mwangi',  phone: '+254700000002', email: 'david@familyos.dev',  role: 'admin', relationship: 'First son',       dateOfBirth: new Date('1988-07-22') },
  { name: 'Sarah Mwangi',  phone: '+254700000003', email: 'sarah@familyos.dev',  role: 'adult', relationship: 'Second daughter',  dateOfBirth: new Date('1991-11-02') },
  { name: 'Peter Mwangi',  phone: '+254700000004', email: 'peter@familyos.dev',  role: 'adult', relationship: 'Third son',        dateOfBirth: new Date('1994-05-19') },
  { name: 'Joy Mwangi',    phone: '+254700000005',                                role: 'minor', relationship: 'Granddaughter',    dateOfBirth: new Date('2010-09-08') },
  { name: 'Uncle Joseph',  phone: '+254700000006',                                role: 'guest', relationship: 'Uncle (visiting)' },
];

async function seed(): Promise<void> {
  // ── Guard: already seeded?
  const existing = await Family.findOne({ slug: 'the-mwangi-family' });
  if (existing && !RESET) {
    log.warn('Seed family already exists. Run with --reset to reseed.');
    return;
  }
  if (existing && RESET) await wipeSeedData();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // ── 1. Users
  const users = await User.insertMany(
    SEED_USERS.map((u) => ({
      name: u.name,
      phone: u.phone,
      email: u.email,
      passwordHash,
      dateOfBirth: u.dateOfBirth,
    }))
  );
  log.ok(`Created ${users.length} users`);

  const userByPhone = Object.fromEntries(users.map((u) => [u.phone, u]));

  // ── 2. Family
  const family = await Family.create({
    name: 'The Mwangi Family',
    slug: 'the-mwangi-family',
    createdBy: userByPhone['+254700000001']._id,
    settings: { currency: 'KES', timezone: 'Africa/Nairobi' },
  });
  log.ok(`Created family: ${family.name} (${family._id})`);

  // ── 3. Memberships
  const memberships = await FamilyMembership.insertMany(
    SEED_USERS.map((u) => ({
      familyId: family._id,
      userId: userByPhone[u.phone]._id,
      role: u.role,
      relationship: u.relationship,
      status: 'active',
      joinedAt: new Date(),
    }))
  );
  log.ok(`Created ${memberships.length} memberships`);

  // ── 4. Event — Mum's 55th birthday reunion
  const startDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

  const birthday = await Event.create({
    familyId: family._id,
    title: "Mum's 55th Birthday Reunion",
    description:
      'Big family reunion at the Karen homestead. Bring photos from the 90s!\nPotluck: please sign up for a dish in the tasks list.',
    type: 'birthday',
    startDate,
    endDate,
    location: { name: 'Karen Homestead', address: 'Karen, Nairobi, Kenya', lat: -1.3194, lng: 36.7073 },
    contributionTarget: 60000,
    currency: 'KES',
    createdBy: userByPhone['+254700000001']._id,
  });
  log.ok(`Created event: ${birthday.title}`);

  // RSVPs — mix of yes / maybe / no
  await RSVP.insertMany([
    { eventId: birthday._id, userId: userByPhone['+254700000001']._id, status: 'yes', guestCount: 0 },
    { eventId: birthday._id, userId: userByPhone['+254700000002']._id, status: 'yes', guestCount: 3 },
    { eventId: birthday._id, userId: userByPhone['+254700000003']._id, status: 'maybe', guestCount: 1 },
    { eventId: birthday._id, userId: userByPhone['+254700000004']._id, status: 'yes', guestCount: 2 },
  ]);
  log.ok('Created RSVPs');

  // ── 5. Contributions (expected per adult)
  const adults = memberships.filter((m) => ['owner', 'admin', 'adult'].includes(m.role));
  await Contribution.insertMany(
    adults.map((m) => ({
      familyId: family._id,
      eventId: birthday._id,
      userId: m.userId,
      amountExpected: 10000,
      amountPaid: m.userId.equals(userByPhone['+254700000002']._id) ? 10000 : 0,
      currency: 'KES',
      status: m.userId.equals(userByPhone['+254700000002']._id) ? 'paid' : 'pending',
    }))
  );
  log.ok(`Created ${adults.length} contribution rows`);

  // ── 6. Tasks
  await Task.insertMany([
    {
      familyId: family._id,
      eventId: birthday._id,
      title: 'Book cake from Kiki Bakes',
      description: 'Vanilla + red velvet, serves 40. Confirm by next Friday.',
      assignedTo: [userByPhone['+254700000003']._id],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      createdBy: userByPhone['+254700000001']._id,
    },
    {
      familyId: family._id,
      eventId: birthday._id,
      title: 'Coordinate transport for diaspora cousins',
      description: 'Pick them up from JKIA on the 14th.',
      assignedTo: [userByPhone['+254700000002']._id, userByPhone['+254700000004']._id],
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'todo',
      createdBy: userByPhone['+254700000001']._id,
    },
    {
      familyId: family._id,
      eventId: null,
      title: 'Pay February school fees',
      description: 'Both Joy and Brian — KES 45,000 combined.',
      assignedTo: [userByPhone['+254700000001']._id],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'todo',
      createdBy: userByPhone['+254700000002']._id,
    },
  ]);
  log.ok('Created 3 tasks');

  // ── 7. Feed posts
  await Post.insertMany([
    {
      familyId: family._id,
      authorId: userByPhone['+254700000001']._id,
      type: 'announcement',
      content:
        'Save the date: Mum’s 55th birthday reunion on the 21st at Karen Homestead. Full details in the Events tab.',
      pinned: true,
      mediaUrls: [],
    },
    {
      familyId: family._id,
      authorId: userByPhone['+254700000003']._id,
      type: 'text',
      content: 'Just landed in Nairobi! Can’t wait to see everyone this weekend. 🛬🇰🇪',
      pinned: false,
      mediaUrls: [],
    },
    {
      familyId: family._id,
      authorId: userByPhone['+254700000002']._id,
      type: 'text',
      content: 'Reminder: contributions portal is live. Pay via M-Pesa from the Contributions tab.',
      pinned: false,
      mediaUrls: [],
    },
  ]);
  log.ok('Created 3 feed posts');

  // ── Summary
  console.log('\n──────────────────────────────────────────────');
  console.log(' SEED COMPLETE');
  console.log('──────────────────────────────────────────────');
  console.log(` Family:      ${family.name}`);
  console.log(` Family ID:   ${family._id}`);
  console.log(` Password:    ${DEMO_PASSWORD}  (all users)`);
  console.log(' Login accounts:');
  SEED_USERS.forEach((u) => console.log(`   ${u.role.padEnd(6)}  ${u.phone}  (${u.name})`));
  console.log('──────────────────────────────────────────────\n');
}

async function main(): Promise<void> {
  try {
    await connect();
    await seed();
  } catch (err) {
    log.err(`Seed failed: ${(err as Error).message}`);
    if (process.env.DEBUG) console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    log.info('Disconnected.');
  }
}

void main();