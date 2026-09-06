# 1. User collection Designing

## fields

| Field             | purpose          |
| ----------------- | ---------------- |
| firstName         | First Name       |
| lastName          | Last name        |
| email             | Login            |
| password          | Authentication   |
| avatar            | Profile picture  |
| role              | Authorization    |
| status            | Active/Inactive  |
| lastLogin         | Security         |
| createdBy         | Audit trail      |
| updatedBy         | Audit trail      |
| createdAt         | Timestamp        |
| updatedAt         | Timestamp        |
| isDeleted         | confirm deletion |
| deletedAt         | deletion date    |
| phone             | Phone number     |
| jobTitle          | Title of Job     |
| passwordChangedAt | -----            |
| isEmailVerified   | is verfied       |

## Required fields:

- firstName
- email
- role
- password
- status

## Unique Fields

- email

## Default values

- avatar : Default avatar
- phone : null
- status: active
- lastLogin: null
- passwordChangedAt: null
- isEmailVerified: false
- createdBy: null
- updatedBy: null
- isDeleted: false
- deletedAt: null
- createdAt: mongoose
- updatedAt: mongoose
- jobTitle: null

## Indexed fields

- email

# Collection 2 — Roles

**Relationship**

Role (1)

↓

Users (Many)

**Fields**

| Field       | Required | Notes                |
| ----------- | -------- | -------------------- |
| name        | Yes      | Admin, HR, Developer |
| description | No       | Optional explanation |
| permissions | Yes      | Array of permissions |
| isDefault   | No       | Default false        |
| status      | Yes      | Active / Inactive    |
| createdAt   | Auto     | Timestamp            |
| updatedAt   | Auto     | Timestamp            |

**Indexes**

- name (Unique)

# Collection 3 — Pages

**Relationship**

User

↓

Pages
(createdBy)

**Fields**

| Field       | Required |
| ----------- | -------- |
| title       | Yes      |
| slug        | Yes      |
| content     | Yes      |
| seo         | Yes      |
| status      | Yes      |
| createdBy   | Yes      |
| updatedBy   | No       |
| publishedAt | No       |
| createdAt   | Auto     |
| updatedAt   | Auto     |

**Indexes**

- slug (Unique)
- status

# Collection 4 — Blogs

**Relationship**

Category

↓

Blogs

Tags

↓

Blogs

User

↓

Blogs

**Fields**

| Field         |
| ------------- |
| title         |
| slug          |
| excerpt       |
| content       |
| featuredImage |
| category      |
| tags          |
| author        |
| seo           |
| status        |
| publishedAt   |
| createdBy     |
| updatedBy     |
| createdAt     |
| updatedAt     |

**Indexes**

- slug
- category
- author
- publishedAt

# Collection 5 — Categories

**Fields**

| Field       |
| ----------- |
| name        |
| slug        |
| description |
| seo         |
| createdAt   |
| updatedAt   |

**Indexes**

- slug
- name

# Collection 6 — Tags

**Fields**

| Field       |
| ----------- |
| name        |
| slug        |
| createdAt   |
| updatedAt   |

**Indexes**

- slug
- name

# Collection 7 — Media

**Relationship**

User

↓

Media

**Fields**

| Field      |
| ---------- |
| title      |
| url        |
| publicId   |
| mimeType   |
| width      |
| height     |
| alt        |
| uploadedBy |
| createdAt  |

**Indexes**

- publicId
- uploadedBy




# Collection 8- Services

**Relationship**

Industry (Many)

↓

Service

**Fields**

| Field            | Required | Unique | Default | Indexed   |
| ---------------- | -------- | ------ | ------- | --------- |
| title            | ✅        | ❌      | -       | ❌         |
| slug             | ✅        | ✅      | -       | ✅         |
| shortDescription | ✅        | ❌      | -       | ❌         |
| description      | ✅        | ❌      | -       | ❌         |
| icon             | ❌        | ❌      | null    | ❌         |
| banner           | ❌        | ❌      | null    | ❌         |
| features         | ❌        | ❌      | []      | ❌         |
| faqs             | ❌        | ❌      | []      | ❌         |
| seo              | ✅        | ❌      | -       | ❌         |
| status           | ✅        | ❌      | draft   | ✅         |
| audit            | ✅        | ❌      | -       | ❌         |
| timestamps       | Auto     | -      | -       | createdAt |




# Collection 9 — Industries

**Examples**
 Healthcare,
 Education,
 Construction


**Fields**

| Field     | Required | Unique | Default | Indexed |
| --------- | -------- | ------ | ------- | ------- |
| title     | ✅        | ❌      | -       | ❌       |
| slug      | ✅        | ✅      | -       | ✅       |
| overview  | ✅        | ❌      | -       | ❌       |
| solutions | ❌        | ❌      | []      | ❌       |
| faqs      | ❌        | ❌      | []      | ❌       |
| seo       | ✅        | ❌      | -       | ❌       |
| status    | ✅        | ❌      | draft   | ✅       |
| audit     | ✅        | ❌      | -       | ❌       |




# Collection 10- Portfolio

**Relationship**

Services

↓

Portfolio

**Fields**

| Field       | Required | Unique | Default   |
| ----------- | -------- | ------ | --------- |
| title       | ✅        | ❌      | -         |
| slug        | ✅        | ✅      | -         |
| client      | ❌        | ❌      | null      |
| industry    | ❌        | ❌      | ObjectId  |
| services    | ❌        | ❌      | []        |
| challenge   | ✅        | ❌      | -         |
| solution    | ✅        | ❌      | -         |
| result      | ✅        | ❌      | -         |
| gallery     | ❌        | ❌      | []        |
| testimonial | ❌        | ❌      | ObjectId  |
| seo         | ✅        | ❌      | -         |
| status      | ✅        | ❌      | published |
| audit       | ✅        | ❌      | -         |


**Indexes**

- slug
- industry

# Collection 11- Testimonials


**Fields**

| Field      | Required | Default   |
| ---------- | -------- | --------- |
| clientName | ✅        | -         |
| company    | ❌        | null      |
| position   | ❌        | null      |
| review     | ✅        | -         |
| rating     | ✅        | 5         |
| image      | ❌        | null      |
| featured   | ❌        | false     |
| status     | ✅        | published |
| audit      | ✅        | -         |



# Collection 12- Leads


| Field             | Required | Default | Indexed |
| ----------------- | -------- | ------- | ------- |
| fullName          | ✅        | -       | ❌       |
| company           | ❌        | null    | ❌       |
| email             | ✅        | -       | ✅       |
| phone             | ❌        | null    | ❌       |
| country           | ❌        | null    | ❌       |
| industry          | ❌        | null    | ❌       |
| budget            | ❌        | null    | ❌       |
| interestedService | ❌        | null    | ✅       |
| message           | ✅        | -       | ❌       |
| source            | ❌        | website | ❌       |
| assignedTo        | ❌        | null    | ✅       |
| status            | ✅        | new     | ✅       |
| notes             | ❌        | []      | ❌       |
| audit             | ✅        | -       | ❌       |



**Indexes**

- slug
- industry

# Collection 13- Consultations

**Fields**

| Field       | Required | Default     |
| ----------- | -------- | ----------- |
| lead        | ✅        | -           |
| meetingDate | ✅        | -           |
| meetingTime | ✅        | -           |
| meetingType | ✅        | Google Meet |
| assignedTo  | ❌        | null        |
| meetingLink | ❌        | null        |
| status      | ✅        | scheduled   |
| notes       | ❌        | []          |
| audit       | ✅        | -           |



# Collection 14- Careers

**Relationship**


**Fields**

| Field            | Required | Default   |
| ---------------- | -------- | --------- |
| title            | ✅        | -         |
| slug             | ✅        | -         |
| department       | ✅        | -         |
| employmentType   | ✅        | Full-time |
| location         | ❌        | Remote    |
| experience       | ❌        | null      |
| salary           | ❌        | null      |
| requirements     | ✅        | []        |
| responsibilities | ✅        | []        |
| deadline         | ❌        | null      |
| seo              | ✅        | -         |
| status           | ✅        | active    |
| audit            | ✅        | -         |



**Indexes**

- slug
- industry

# Collection 15- Applications



**Fields**

| Field       | Required | Default |
| ----------- | -------- | ------- |
| career      | ✅        | -       |
| fullName    | ✅        | -       |
| email       | ✅        | -       |
| phone       | ❌        | null    |
| resume      | ✅        | -       |
| portfolio   | ❌        | null    |
| coverLetter | ❌        | null    |
| status      | ✅        | applied |
| reviewedBy  | ❌        | null    |
| notes       | ❌        | []      |
| audit       | ✅        | -       |




# Collection 16- Settings

**Relationship**

Services

↓

Portfolio

**Fields**

| Field           | Required |
| --------------- | -------- |
| companyName     | ✅        |
| companyEmail    | ✅        |
| phone           | ✅        |
| address         | ✅        |
| logo            | ✅        |
| favicon         | ❌        |
| socialLinks     | ❌        |
| seoDefaults     | ✅        |
| analytics       | ❌        |
| smtp            | ❌        |
| maintenanceMode | ❌        |
| updatedBy       | ❌        |


# Final Relationship Diagram



Role
 │
 └──────────────► Users
                    │
                    ├────────► Blogs
                    ├────────► Pages
                    ├────────► Media
                    ├────────► Services
                    ├────────► Industries
                    ├────────► Portfolio
                    ├────────► Careers
                    └────────► Leads

Categories ───────► Blogs
Tags ─────────────► Blogs

Services ─────────► Portfolio
Industries ───────► Portfolio

Testimonials ─────► Portfolio

Leads ────────────► Consultations

Careers ──────────► Applications