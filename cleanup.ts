/**
 * FamilyOS — Cleanup Script
 *
 * Usage:
 *   npm run cleanup                    # remove ALL seed data (default, safe)
 *   npm run cleanup -- --all           # NUKE the entire database (dev only!)
 *   npm run cleanup -- --family=<id>   # delete a single family + its data
 *   npm run cleanup -- --user=<phone>  # delete a single user
 *
 * Notes:
 *   • Refuses to run against NODE_ENV=production unless --i-know-what-im-doing.
 *   • Deletes in dependency order (children → parents) to avoid dangling refs.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { User } from '../server/src/models/User';
import { Family } from '../server/src/models/Family';
import { FamilyMembership } from '../server/src/models/FamilyMembership';
import { Event } from '../server/src/models/Event';
import { RSVP } from '../server/src/models/RSVP';
import { Task } from '../server/src/models/Task';
import { Post } from '../server/src/models/Post';
import { Comment } from '../server/src/models/Comment';
import { Reaction } from '../server/src/models/Reaction';
import { Contribution } from '../server/src/models/Contribution';
import { Payment } from '../server/src/models/Payment';
import { Invitation } from '../server/src/models/Invitation';
import { Notification } from '../server/src/models/Notification';
import { VaultDocument } from '../server/src/models/VaultDocument';

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return undefined;
  return hit.includes('=') ? hit.split('=')[1] : '';
};
const has = (name: string): boolean => flag(name) !== undefined;

const log = {
  info: (m: string) => console.log(`\x1b[36m[cleanup]\x1b[0m ${m}`),
  ok: (m: string) => console.log(`\x1b[32m[cleanup] ✓\x1b[0m ${m}`),
  warn: (m: string) => console.log(`\x1b[33m[cleanup] !\x1b[0m ${m}`),
  err: (m: string) => console.error(`\x1b[31m[cleanup] ✗\x1b[0m ${m}`),
};

async function connect(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing — copy .env.example → .env first');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  log.ok(`Connected to ${mongoose.connection.host}`);
}

// ─────────────────────────────────────────────────────────────
// Deletion helpers
// ─────────────────────────────────────────────────────────────

/** Delete every child document that references the given family. */
async function deleteFamilyCascade(familyId: mongoose.Types.ObjectId): Promise<void> {
  const eventIds = await Event.find({ familyId }).distinct('_id');
  const postIds = await Post.find({ familyId }).distinct('_id');
  const contributionIds = await Contribution.find({ familyId }).distinct('_id');

  await Promise.all([
    RSVP.deleteMany({ eventId: { $in: eventIds } }),
    Comment.deleteMany({ postId: { $in: postIds } }),
    Reaction.deleteMany({ postId: { $in: postIds } }),
    Payment.deleteMany({ contributionId: { $in: contributionIds } }),
  ]);

  await Promise.all([
    Event.deleteMany({ familyId }),
    Post.deleteMany({ familyId }),
    Task.deleteMany({ familyId }),
    Contribution.deleteMany({ familyId }),
    Invitation.deleteMany({ familyId }),
    Notification.deleteMany({ familyId }),
    VaultDocument.deleteMany({ familyId }),
    FamilyMembership.deleteMany({ familyId }),
  ]);

  await Family.findByIdAndDelete(familyId);
}

/** Delete a user and everything that references them. */
async function deleteUserCascade(userId: mongoose.Types.ObjectId): Promise<void> {
  await Promise.all([
    FamilyMembership.deleteMany({ userId }),
    RSVP.deleteMany({ userId }),
    Contribution.deleteMany({ userId }),
    Notification.deleteMany({ userId }),
    Reaction.deleteMany({ userId }),
    Comment.deleteMany({ authorId: userId }),
  ]);
  await User.findByIdAndDelete(userId);
}

// ─────────────────────────────────────────────────────────────
// Modes
// ─────────────────────────────────────────────────────────────

async function cleanupSeedData(): Promise<void> {
  log.info('Removing seed dataset…');
  const family = await Family.findOne({ slug: 'the-mwangi-family' });

  if (family) {
    await deleteFamilyCascade(family._id);
    log.ok(`Deleted family ${family.name}`);
  } else {
    log.warn('Seed family not found (nothing to do)');
  }

  const seedPhones = [
    '+254700000001', '+254700000002', '+254700000003',
    '+254700000004', '+254700000005', '+254700000006',
  ];
  const { deletedCount } = await User.deleteMany({ phone: { $in: seedPhones } });
  log.ok(`Deleted ${deletedCount} seed users`);
}

async function cleanupFamily(familyId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(familyId)) throw new Error(`Invalid family ID: ${familyId}`);
  log.info(`Deleting family ${familyId} and all related data…`);
  await deleteFamilyCascade(new mongoose.Types.ObjectId(familyId));
  log.ok('Family deleted.');
}

async function cleanupUser(phone: string): Promise<void> {
  const user = await User.findOne({ phone });
  if (!user) {
    log.warn(`No user with phone ${phone}`);
    return;
  }
  log.info(`Deleting user ${user.name} (${phone})…`);
  await deleteUserCascade(user._id);
  log.ok('User deleted.');
}

async function nukeEverything(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && !has('i-know-what-im-doing')) {
    throw new Error(
      'Refusing to wipe production. Re-run with --i-know-what-im-doing if you are absolutely sure.'
    );
  }

  log.warn('⚠️  Dropping the ENTIRE database…');
  const collections = await mongoose.connection.db!.listCollections().toArray();
  for (const c of collections) {
    await mongoose.connection.db!.collection(c.name).deleteMany({});
    log.info(`  cleared ${c.name}`);
  }
  log.ok('All collections cleared.');
}

// ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    await connect();

    const all = has('all');
    const familyId = flag('family');
    const userPhone = flag('user');

    if (all) {
      await nukeEverything();
    } else if (familyId) {
      await cleanupFamily(familyId);
    } else if (userPhone) {
      await cleanupUser(userPhone);
    } else {
      await cleanupSeedData();
    }
  } catch (err) {
    log.err(`Cleanup failed: ${(err as Error).message}`);
    if (process.env.DEBUG) console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    log.info('Disconnected.');
  }
}

void main();