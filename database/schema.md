
---

## 📂 `docs/database/`

### 📄 `docs/database/schema.md`

```markdown
# FamilyOS — Database Schema

MongoDB / Mongoose. Single shared cluster. Every tenant-scoped document carries `familyId`.

## Conventions

- **IDs:** `ObjectId` unless noted.
- **Timestamps:** every collection has `createdAt` / `updatedAt` (via `{ timestamps: true }`) unless append-only.
- **Soft delete:** `FamilyMembership.status = 'removed'` rather than hard delete.
- **Indexes:** listed below each schema; every tenant collection has `(familyId, <sortKey>)`.

---

## 1. Family

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `name` | String | Display name |
| `slug` | String, unique | Used in URLs |
| `coverPhotoUrl` | String | Optional |
| `createdBy` | ObjectId → User | Becomes Owner |
| `settings.currency` | String | Default `KES` |
| `settings.timezone` | String | Default `Africa/Nairobi` |
| `createdAt` / `updatedAt` | Date | |

**Indexes:** `{ slug: 1 }` (unique)

---

## 2. User

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `name` | String | |
| `phone` | String, unique | Primary login identifier (E.164) |
| `email` | String, unique, sparse | Optional |
| `passwordHash` | String | bcrypt, `select: false` |
| `avatarUrl` | String | |
| `dateOfBirth` | Date | Optional — powers birthday reminders |
| `createdAt` / `updatedAt` | Date | |

**Indexes:** `{ phone: 1 }` (unique)

---

## 3. FamilyMembership

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `userId` | ObjectId → User | Indexed |
| `role` | Enum | `owner`, `admin`, `adult`, `minor`, `guest` |
| `relationship` | String | Free text, e.g. "Aunt" |
| `status` | Enum | `active`, `invited`, `removed` |
| `joinedAt` | Date | |

**Indexes:** `{ familyId: 1, userId: 1 }` (unique)

---

## 4. Event

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `title` | String | |
| `description` | String | |
| `type` | Enum | `birthday`, `wedding`, `funeral`, `reunion`, `graduation`, `other` |
| `startDate` | Date | |
| `endDate` | Date | Optional |
| `location.name` | String | |
| `location.address` | String | |
| `location.lat` / `location.lng` | Number | Optional geopoint |
| `coverPhotoUrl` | String | |
| `contributionTarget` | Number | Optional; drives progress bar |
| `currency` | String | Default from Family |
| `createdBy` | ObjectId → User | |

**Indexes:** `{ familyId: 1, startDate: 1 }`

---

## 5. RSVP

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `eventId` | ObjectId → Event | Indexed |
| `userId` | ObjectId → User | |
| `status` | Enum | `yes`, `maybe`, `no`, `pending` |
| `guestCount` | Number | Default 0 |
| `respondedAt` | Date | |

**Indexes:** `{ eventId: 1, userId: 1 }` (unique)

---

## 6. Task

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `eventId` | ObjectId → Event | `null` for family-wide |
| `title` | String | |
| `description` | String | |
| `assignedTo` | [ObjectId] → User | One or more |
| `dueDate` | Date | |
| `status` | Enum | `todo`, `in_progress`, `done` |
| `createdBy` | ObjectId → User | |

**Indexes:**
- `{ familyId: 1, status: 1 }`
- `{ assignedTo: 1, status: 1 }`

---

## 7. Contribution

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `eventId` | ObjectId → Event | Optional; `null` = general fund |
| `userId` | ObjectId → User | Who owes/paid |
| `amountExpected` | Number | |
| `amountPaid` | Number | |
| `currency` | String | |
| `status` | Enum | `pending`, `partial`, `paid` — derived |

**Indexes:** `{ familyId: 1, eventId: 1, userId: 1 }`

---

## 8. Payment

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `contributionId` | ObjectId → Contribution | Indexed |
| `provider` | Enum | `mpesa`, `card`, `cash`, `bank` |
| `providerRef` | String | M-Pesa receipt / gateway txn ID |
| `amount` | Number | |
| `currency` | String | |
| `status` | Enum | `initiated`, `success`, `failed` |
| `rawCallbackPayload` | Mixed | Stored for reconciliation and disputes |
| `createdAt` | Date | |

**Indexes:** `{ contributionId: 1 }`, `{ providerRef: 1 }`

---

## 9. Post

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `authorId` | ObjectId → User | |
| `type` | Enum | `text`, `photo`, `video`, `announcement`, `emergency` |
| `content` | String | |
| `mediaUrls` | [String] | Up to 10 |
| `pinned` | Boolean | Announcements + emergencies auto-pin |
| `eventId` | ObjectId → Event | Optional; scoped feed |

**Indexes:**
- `{ familyId: 1, createdAt: -1 }`
- `{ familyId: 1, pinned: -1, createdAt: -1 }`

---

## 10. Comment

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `postId` | ObjectId → Post | Indexed |
| `authorId` | ObjectId → User | |
| `content` | String | |
| `parentCommentId` | ObjectId → Comment | Optional; threaded replies |
| `createdAt` | Date | |

**Indexes:** `{ postId: 1 }`

---

## 11. Reaction

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `postId` | ObjectId → Post | Indexed |
| `userId` | ObjectId → User | |
| `type` | Enum | `like`, `love`, `pray`, `laugh` |
| `createdAt` | Date | |

**Indexes:** `{ postId: 1, userId: 1 }` (unique — one reaction per user per post)

---

## 12. Invitation

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `code` | String, unique | Short, human-readable |
| `roleOnJoin` | Enum | Role assigned on acceptance |
| `relationship` | String | Optional default |
| `createdBy` | ObjectId → User | |
| `expiresAt` | Date | |
| `maxUses` | Number | Optional |
| `usesCount` | Number | Default 0 |
| `createdAt` | Date | |

**Indexes:** `{ code: 1 }` (unique)

---

## 13. Notification

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `userId` | ObjectId → User | Indexed |
| `familyId` | ObjectId → Family | Optional |
| `type` | String | e.g. `post.new`, `rsvp.update`, `payment.success` |
| `payload` | Mixed | Event-specific data |
| `read` | Boolean | Default false |
| `createdAt` | Date | |

**Indexes:** `{ userId: 1, read: 1, createdAt: -1 }`

---

## 14. VaultDocument

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `familyId` | ObjectId → Family | Indexed |
| `fileUrl` | String | Cloudinary / S3 path (private) |
| `fileName` | String | Display name |
| `category` | String | e.g. `legal`, `medical`, `photos` |
| `accessLevel` | Enum | `owner`, `admin`, `adult`, `all` |
| `uploadedBy` | ObjectId → User | |
| `createdAt` | Date | |

**Indexes:** `{ familyId: 1, accessLevel: 1 }`

---

## 15. Relationship Map

```mermaid
erDiagram
    USER ||--o{ FAMILY_MEMBERSHIP : "belongs to"
    FAMILY ||--o{ FAMILY_MEMBERSHIP : "has members"
    FAMILY ||--o{ EVENT : "schedules"
    FAMILY ||--o{ POST : "publishes"
    FAMILY ||--o{ TASK : "tracks"
    FAMILY ||--o{ INVITATION : "issues"
    FAMILY ||--o{ VAULT_DOCUMENT : "stores"

    EVENT ||--o{ RSVP : "receives"
    EVENT ||--o{ TASK : "scopes"
    EVENT ||--o{ CONTRIBUTION : "funds"

    POST ||--o{ COMMENT : "has"
    POST ||--o{ REACTION : "receives"

    CONTRIBUTION ||--o{ PAYMENT : "settled by"

    USER ||--o{ POST : "authors"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ REACTION : "gives"
    USER ||--o{ RSVP : "responds"
    USER ||--o{ CONTRIBUTION : "owes"
    USER ||--o{ NOTIFICATION : "receives"