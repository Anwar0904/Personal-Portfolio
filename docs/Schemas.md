## 1. SEO Schema

Used by:

- Pages
- Blogs
- Services
- Industries
- Portfolio
- Careers



| Field           | Required | Default        | Notes                  |
| --------------- | -------- | -------------- | ---------------------- |
| metaTitle       | ✅        | -              | Max ~60 chars          |
| metaDescription | ✅        | -              | Max ~160 chars         |
| keywords        | ❌        | string[]       | Array of keywords      |
| canonicalUrl    | ❌        | null           | Canonical link         |
| ogTitle         | ❌        | null           | Open Graph title       |
| ogDescription   | ❌        | null           | Open Graph description |
| ogImage         | ❌        | null           | ImageSchema            |
| robots          | ❌        | "index,follow" | SEO robots             |
| schemaMarkup    | ❌        | null           | Object (JSON-LD)       |


## 2. Image Schema

Used by:

- Avatar
- Featured Image
- Banner
- Logo
- Portfolio Gallery

| Field    | Required | Default |
| -------- | -------- | ------- |
| url      | ✅        | -       |
| publicId | ✅        | -       |
| alt      | ❌        | ""      |
| width    | ❌        | null    |
| height   | ❌        | null    |
| mimeType | ❌        | -       |
| size     | ❌        | -       |


## 3. Audit Fields

Used by almost every collection.


| Field     | Required | Default |
| --------- | -------- | ------- |
| createdBy | ❌        | null    |
| updatedBy | ❌        | null    |
| isDeleted | ❌        | false   |
| deletedAt | ❌        | null    |


## 4. Status Enum

Instead of inventing status values in every collection, standardize them.

### Content Status
draft
published
archived

### User Status
active
inactive
suspended

### Lead Status
new
contacted
qualified
proposal_sent
won
lost

### Employment Type

Full-time
Part-time
Contract
Internship
Remote

### Application Status
applied
reviewing
shortlisted
interview
accepted
rejected

### Meeting Type

Google Meet
Zoom
Microsoft Teams
Phone
In Person

## User Roles

Super Admin
Admin
Content Editor
Marketing
HR
Developer

## Media Type

image
video
document
pdf


Notice how each module has its own status values.

## 5. Social Links Schema

| Field     |
| --------- |
| facebook  |
| linkedin  |
| instagram |
| x         |
| youtube   |
| github    |


## 6. FAQs.

|  Fields   |
|-----------|
|  question |
|  answer   |


## 7. Features.


title

description

icon

## 8. Analytics

googleAnalyticsId

googleTagManagerId

facebookPixelId

## 9. SMTP Schema

host

port

username

password

fromEmail

fromName
