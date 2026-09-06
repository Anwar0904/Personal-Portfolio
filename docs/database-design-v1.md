# Database Design for ADM V-1

## Project Overview

*Arazi Digital Media* (ADM) is a Digital Growth & Brand Transformation Company helping
businesses generate more leads, increase sales, strengthen brands and accelerate
growth through digital marketing, AI, branding and technology.

ADM first version will be offer the visitors to access the home page, View Services, Wiew Portfolio, Vio industries, REad blogs, contact company, and also cna Book Consultation 

## Actors 
There are mainly 3 actors of ADM version-1

### 1. Visitor

- What they can do :
- Visit website
- Read blogs
- Read services
- Contact company
- Book consultation
- Apply for jobs

### 2. Staff Member

- For example:
- Admin
- Content Editor
- HR
- Marketing
- Developer

### 3. Super Admin

Responsibilities

- Manage users
- Assign roles
- Manage website settings
- Manage CMS
- View leads
- Manage consultations
- Manage careers
- Access every module

## Business Modules

ADM consist of 6 main modules eah module then contain there own entites 

### 1. Authentication
**Purpose**:
 manage who can login

**Collections**
 Users,
 roles
 
### 2. CMS
**Purpose**:
 Manage website content.

**Collections**
 pages,
 blogs,
 categories,
 tags,
 media

### 3. Business
**Purpose**:
 it shows what ADM basically offers

**Collections**
 services,
 industries,
 portfolio,
 testimonials

### 4. Lead Management
**Purpose**:
 Generate Clients, this module makes the company money

**Collections**
 leads,
 consultations

### 5. Recruitment
**Purpose**:
 It manage hiring and Internships 

**Collections**
 careers,
 applications

### 6. Configuration
**Purpose**:
 Manages Global Website Configuration/settings

**Collections**
 settings




## Entities

Following are the all 16 entities of ADM project
 users,
 roles,
 pages,
 blogs,
 categories,
 tags,
 media,
 services,
 industries,
 portfolio,
 testimonials,
 leads,
 consultations,
 careers,
 applications,
 settings