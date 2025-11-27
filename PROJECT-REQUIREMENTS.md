# Project Requirements - Multi-Tenant Monorepo System

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [User Roles](#-user-roles)
- [System Architecture](#️-system-architecture)
- [Database Schema](#-database-schema)
- [Core Features](#-core-features)
- [UI/UX Requirements](#-uiux-requirements)
- [Security Requirements](#-security-requirements)
- [API Endpoints](#-api-endpoints)
- [Deployment Requirements](#-deployment-requirements)
- [Platform Support](#-platform-support)
- [Testing Requirements](#-testing-requirements)
- [Scalability](#-scalability)
- [Data Sharing Logic](#-data-sharing-logic)
- [User Stories](#-user-stories)
- [Acceptance Criteria](#-acceptance-criteria)
- [Development Phases](#-development-phases)
- [Success Metrics](#-success-metrics)
- [Support & Maintenance](#-support--maintenance)

## 🎯 Project Overview

A **Monorepo-based Multi-Tenant SaaS Platform** where a Super Admin can dynamically create customer accounts, each with their own dedicated site. All sites share a single database, and data can be shared between sites.

---

## 👥 User Roles

### 1. Super Admin
- Full system access
- Create, manage, and delete customer accounts
- View all data across all customer sites
- Configure system-wide settings

### 2. Customer
- Access only to their own site
- Add and manage data (Name + Age entries)
- Share data with other customer sites
- View shared data from other sites

---

## 🏗️ System Architecture

### Monorepo Structure
```
my-monorepo2/
├── apps/
│   ├── admin/              # Super Admin Dashboard
│   ├── customer-site/      # Dynamic Customer Sites (Template)
│   └── api/                # Backend API Server
├── packages/
│   ├── database/           # Prisma + Database Schema
│   ├── ui/                 # Shared UI Components
│   ├── auth/               # Authentication System
│   └── shared/             # Shared Types & Utils
```

### Technology Stack
- **Frontend Framework:** Next.js 14 (App Router)
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Monorepo Tool:** Turborepo
- **Language:** TypeScript
- **Package Manager:** npm

---

## 💾 Database Schema

### Users Table
```
User
├── id: Int (Primary Key)
├── email: String (Unique)
├── password: String (Hashed)
├── name: String
├── role: Enum (SUPERADMIN, CUSTOMER)
├── createdAt: DateTime
└── customer: Customer? (One-to-One Relation)
```

### Customers Table
```
Customer
├── id: Int (Primary Key)
├── userId: Int (Foreign Key → User)
├── companyName: String
├── subdomain: String (Unique) // e.g., "acme", "tech-corp"
├── domain: String // e.g., "acme.myapp.com"
├── color: String // Brand color (#hex)
├── logo: String? (Optional)
├── isActive: Boolean (Default: true)
├── createdAt: DateTime
└── profiles: Profile[] (One-to-Many Relation)
```

### Profiles Table
```
Profile
├── id: Int (Primary Key)
├── name: String
├── age: Int
├── customerId: Int (Foreign Key → Customer)
├── sharedWith: String? // JSON array of customer IDs
├── createdAt: DateTime
└── customer: Customer (Relation)
```

---

## ✨ Core Features

### 🔷 Super Admin Features

#### 1. Authentication
- Secure login with email + password
- Protected admin routes
- Session management

#### 2. Customer Management
- **Create Customer:**
  - Enter: Company Name, Email, Password, Subdomain, Brand Color
  - Auto-generate unique subdomain
  - Create customer account and site simultaneously
  
- **View All Customers:**
  - List with: Company Name, Subdomain, Status, Created Date
  - Search and filter functionality
  
- **Edit Customer:**
  - Update: Company Name, Color, Logo, Status
  - Cannot change subdomain after creation
  
- **Delete/Deactivate Customer:**
  - Soft delete (set isActive = false)
  - Option to permanently delete with all data

#### 3. Data Overview
- View all profiles across all customers
- Filter by customer
- Export data functionality

#### 4. Dashboard
- Total customers count
- Total profiles count
- Recent activities
- System health status

---

### 🔷 Customer Site Features

#### 1. Authentication
- Login with email + password provided by Super Admin
- Change password functionality
- Logout

#### 2. Profile Management
- **Add Profile:**
  - Input fields: Name (required), Age (required)
  - Select which customers to share with (checkboxes)
  - Submit and save to database
  
- **View Profiles:**
  - Display own profiles (highlighted with brand color)
  - Display shared profiles from other customers
  - Show source customer name for shared profiles
  
- **Edit Sharing:**
  - Toggle sharing with specific customers
  - Update in real-time

#### 3. Site Customization
- Display customer's company name
- Apply customer's brand color to UI elements
- Show customer's logo (if provided)

#### 4. Dashboard
- Total profiles created by this customer
- Total shared profiles
- Recent activities

---

## 🎨 UI/UX Requirements

### Design Principles
- Clean, modern interface
- Responsive design (mobile, tablet, desktop)
- RTL support (Arabic)
- Accessibility (WCAG AA compliant)

### Color Scheme
- Super Admin: Blue theme (#3b82f6)
- Customer Sites: Dynamic based on customer's brand color

### Components
- Dashboard cards
- Data tables with pagination
- Forms with validation
- Modals for actions
- Loading states
- Error messages
- Success notifications

---

## 🔐 Security Requirements

### Authentication
- Bcrypt password hashing
- JWT-based sessions
- Secure HTTP-only cookies
- CSRF protection

### Authorization
- Role-based access control (RBAC)
- Route protection middleware
- API endpoint authorization

### Data Protection
- Customer data isolation
- Encrypted sensitive data
- SQL injection prevention (Prisma ORM)
- XSS protection

---

## 📊 API Endpoints

### Super Admin APIs
```
POST   /api/admin/login          # Admin login
POST   /api/admin/customers      # Create customer
GET    /api/admin/customers      # List all customers
GET    /api/admin/customers/:id  # Get customer details
PATCH  /api/admin/customers/:id  # Update customer
DELETE /api/admin/customers/:id  # Delete customer
GET    /api/admin/profiles       # Get all profiles
GET    /api/admin/stats          # Dashboard statistics
```

### Customer APIs
```
POST   /api/auth/login           # Customer login
POST   /api/auth/logout          # Customer logout
GET    /api/profiles             # Get profiles (own + shared)
POST   /api/profiles             # Create profile
PATCH  /api/profiles/:id         # Update profile sharing
DELETE /api/profiles/:id         # Delete profile
GET    /api/customer/info        # Get customer site info
```

---

## 🚀 Deployment Requirements

### Hosting
- **Platform:** Vercel (Recommended) or AWS
- **Domain:** Custom domain with wildcard subdomain support
  - Example: *.myapp.com → Routes to customer sites

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://myapp.com"
ADMIN_EMAIL="admin@myapp.com"
ADMIN_PASSWORD_HASH="..."
```

### Performance
- Server-side rendering (SSR) for SEO
- Static generation where possible
- Image optimization
- CDN for assets
- Database connection pooling

---

## 📱 Platform Support

### Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Devices
- Desktop (1920×1080 and above)
- Tablet (768×1024)
- Mobile (375×667 and above)

---

## 🧪 Testing Requirements

### Unit Tests
- Component testing (React Testing Library)
- API route testing
- Database query testing

### Integration Tests
- User flow testing
- API integration testing

### E2E Tests
- Critical user journeys
- Admin workflows
- Customer workflows

---

## 📈 Scalability

### Current Phase (MVP)
- Support up to 100 customers
- Up to 1,000 profiles per customer
- Single database instance

### Future Phases
- Database sharding per customer
- Redis caching layer
- Queue system for heavy operations
- Microservices architecture

---

## 🔄 Data Sharing Logic

### How Sharing Works
1. Customer A creates a profile (Name: John, Age: 25)
2. Customer A selects to share with Customer B and C
3. Profile is saved with `sharedWith: [B_ID, C_ID]`
4. Customer B and C can now view this profile
5. Profile shows "From Customer A" badge
6. Customer A can revoke sharing anytime

### Sharing Rules
- A customer can only share their own profiles
- Shared profiles are read-only for recipients
- Super Admin can see all profiles regardless of sharing

---

## 📝 User Stories

### Super Admin
- "As a Super Admin, I want to create a new customer account so that they can use the platform"
- "As a Super Admin, I want to view all customer data to monitor system usage"
- "As a Super Admin, I want to deactivate a customer to suspend their access"

### Customer
- "As a Customer, I want to add profiles with name and age to store my data"
- "As a Customer, I want to share my data with specific customers for collaboration"
- "As a Customer, I want to view profiles shared with me by other customers"
- "As a Customer, I want my site to reflect my brand with custom colors"

---

## ✅ Acceptance Criteria

### Super Admin
- [ ] Can login with admin credentials
- [ ] Can create unlimited customer accounts
- [ ] Can assign unique subdomains
- [ ] Can view list of all customers
- [ ] Can activate/deactivate customers
- [ ] Can view all profiles across the system
- [ ] Dashboard shows accurate statistics

### Customer Site
- [ ] Each customer has unique subdomain (customer1.myapp.com)
- [ ] Customer can login with credentials
- [ ] Can add profiles with Name + Age
- [ ] Can select which customers to share with
- [ ] Can view own profiles highlighted
- [ ] Can view shared profiles from others
- [ ] Can toggle sharing on/off
- [ ] Site displays customer's brand color
- [ ] Site displays customer's company name

### System
- [ ] Single database for all customers
- [ ] Data properly isolated between customers
- [ ] Sharing mechanism works correctly
- [ ] All sites responsive and mobile-friendly
- [ ] Authentication secure
- [ ] No data leaks between customers
- [ ] Fast performance (<2s page load)

---

## 📅 Development Phases

### Phase 1: Foundation (Week 1-2)
- Setup Monorepo with Turborepo
- Configure database with Prisma
- Implement authentication system
- Create basic UI components

### Phase 2: Super Admin (Week 3)
- Build Admin dashboard
- Implement customer CRUD operations
- Add statistics and monitoring

### Phase 3: Customer Sites (Week 4)
- Build customer site template
- Implement dynamic routing
- Add profile management features

### Phase 4: Sharing & Polish (Week 5)
- Implement data sharing logic
- Add brand customization
- Testing and bug fixes

### Phase 5: Deployment (Week 6)
- Setup production environment
- Configure domain and subdomains
- Deploy and monitor

---

## 🎯 Success Metrics

- [ ] Super Admin can create customer in <2 minutes
- [ ] Customer can add profile in <30 seconds
- [ ] Page load time <2 seconds
- [ ] Zero security vulnerabilities
- [ ] 99.9% uptime
- [ ] Mobile responsive score >90

---

## 📞 Support & Maintenance

### Documentation
- API documentation
- Admin user guide
- Customer user guide
- Developer documentation

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Database health checks
- Uptime monitoring

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Project Type:** Multi-Tenant SaaS Platform  
**Architecture:** Monorepo with Turborepo

## 📑 Implementation Notes

### Prisma Schema Example
```prisma
// This is an example of how the Prisma schema might look
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  password    String
  name        String
  role        Role     @default(CUSTOMER)
  createdAt   DateTime @default(now())
  customer    Customer?
}

enum Role {
  SUPERADMIN
  CUSTOMER
}

model Customer {
  id          Int       @id @default(autoincrement())
  userId      Int       @unique
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName String
  subdomain   String    @unique
  domain      String
  color       String
  logo        String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  profiles    Profile[]
}

model Profile {
  id          Int       @id @default(autoincrement())
  name        String
  age         Int
  customerId  Int
  customer    Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)
  sharedWith  String?   // JSON array of customer IDs
  createdAt   DateTime  @default(now())
}
```

### Subdomain Routing Strategy
For handling subdomains in Next.js:

1. Use middleware to detect and route based on subdomain:
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { hostname } = url
  
  // Extract subdomain (e.g., "customer1" from "customer1.myapp.com")
  const subdomain = hostname.split('.')[0]
  
  // Check if this is a customer subdomain
  if (subdomain !== 'admin' && subdomain !== 'www' && subdomain !== 'api') {
    // Route to the customer site app with the subdomain as a parameter
    url.pathname = `/customer-site/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}
```

2. Local development considerations:
   - Use `.localhost` domains for testing (e.g., `customer1.localhost:3000`)
   - Configure DNS wildcards for production environments

### Authentication Flow
For NextAuth.js implementation:

1. Different authentication providers for Super Admin and Customers
2. Role-based session data
3. Middleware for route protection

### Data Sharing Implementation
```typescript
// Example API route for toggling profile sharing
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { profileId, customerId, isShared } = req.body
  
  // Get current profile
  const profile = await prisma.profile.findUnique({
    where: { id: profileId }
  })
  
  // Parse current sharedWith JSON array
  const sharedWith = profile.sharedWith ? JSON.parse(profile.sharedWith) : []
  
  // Add or remove customer ID based on isShared value
  let newSharedWith = isShared
    ? [...sharedWith, customerId]
    : sharedWith.filter(id => id !== customerId)
  
  // Update profile with new sharing settings
  await prisma.profile.update({
    where: { id: profileId },
    data: { sharedWith: JSON.stringify(newSharedWith) }
  })
  
  return res.status(200).json({ success: true })
}
```
