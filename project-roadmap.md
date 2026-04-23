# Admin Platform & Website Development Roadmap

## Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS
* **Backend/API:** Vercel API Routes (Serverless)
* **Database:** Neon (Serverless PostgreSQL)
* **Email Provider:** Brevo

---

## Epic 1: Public Frontend & System Initialization
- [x] **Task 1.1: Global Layout & Design System Setup**
  - [x] **Analyze reference HTML design files located in the `design-html` folder** to extract exact Tailwind class combinations and layout structures.
  - [x] Initialize Next.js project with Tailwind CSS.
  - [x] Set up global CSS variables for typography and brand colors.
  - [x] Build responsive Header with text-based logo.
  - [x] Build Footer with standard policy links.
- [x] **Task 1.2: Hero Section** (Replaced by Holographic Job Matrix)
- [x] **Task 1.3: Value Proposition Section**
- [x] **Task 1.4: Process / How It Works**
- [x] **Task 1.5: Trust & Conversion** (Replaced by Quantum Application Portal)

## Epic 2: Identity & Access Management (IAM)
- [x] **Task 2.1: Database Schema (Neon)**
  - [x] Create `users` table (id, email, password_hash, role, created_at).
  - [x] Create `password_resets` table (token, user_id, expires_at).
- [x] **Task 2.2: Login Interface & Logic**
  - [x] Build Login UI form.
  - [x] Create Vercel API route `/api/auth/login`.
  - [x] Implement JWT/Session handling and secure cookie storage.
- [x] **Task 2.3: Forgot Password Flow**
  - [x] Build "Forgot Password" UI and "Reset Password" UI.
  - [x] Create Vercel API route `/api/auth/forgot-password`.
  - [x] Integrate Brevo API to send secure reset tokens.
  - [x] Create Vercel API route `/api/auth/reset-password`.
- [x] **Task 2.4: Logout Mechanism**
  - [x] Create Vercel API route `/api/auth/logout` to destroy session.
  - [x] Implement frontend redirect logic.

## Epic 3: Core Operations
- [x] **Task 3.1: Database Schema (Neon)**
  - [x] Create `applications` table (id, name, role, score, status, data_json).
  - [x] Create `jobs` table (id, title, country, salary, category, status).
- [x] **Task 3.2: Application Center**
  - [x] Create Vercel API route `/api/applications` (GET, PUT).
  - [x] Build Left Pane: Scrollable, filterable applicant list.
  - [x] Build Right Pane: Interactive Holographic Dossier (3D card, Match Score Ring, Skill Radar chart).
- [x] **Task 3.3: Recruitment Pipeline (Kanban)**
  - [x] Implement drag-and-drop Kanban UI.
  - [x] Create API sync to update application `status` on drag-drop.
  - [x] Build X-Ray hover tooltip for candidate quick-stats.
- [x] **Task 3.4: Global Job Position Inventory**
  - [x] Create Vercel API route `/api/jobs` (GET, POST, PUT, DELETE).
  - [x] Build data grid with region/category filter pills.
  - [x] Implement "Add/Edit Position" modal form connected to API.

## Epic 4: Global Settings & Utilities
- [x] **Task 4.1: Database Schema (Neon)**
  - [x] Create `notifications` table (id, message, is_read, user_id).
- [x] **Task 4.2: Profile Settings**
  - [x] Build UI for admin details update and password change.
  - [x] Create Vercel API route `/api/settings/profile`.
- [x] **Task 4.3: General Settings**
  - [x] Build UI for platform-wide configurations.
- [x] **Task 4.4: Notification System**
  - [x] Create Vercel API route `/api/notifications` (GET, Mark-as-read).
  - [x] Build top bar bell icon dropdown with unread state logic.


  ## Epic 5: Document Verification & Secure Delivery (Nomadpay & Payoneer)
- [ ] **Task 5.1: Database Schema Update (Neon)**
  - [ ] Create `documents` table (id, candidate_id, document_type, unique_code, pdf_url, is_paid, payment_status, payment_provider, transaction_id).
- [ ] **Task 5.2: Public Verification Portal**
  - [ ] Build a public-facing UI page (`/verify`) with a search input for the unique code.
  - [ ] Create Vercel API route `/api/verify-code` to validate the code against the database.
  - [ ] Build the success state UI: Display candidate info, document status, and two distinct CTAs: "Pay with Nomadpay" and "Pay with Payoneer".
- [ ] **Task 5.3: Dual Payment Gateway & Webhook Architecture**
  - [ ] Create Vercel API routes for checkout generation: `/api/checkout/nomadpay` and `/api/checkout/payoneer`.
  - [ ] Create dedicated Vercel API routes for webhooks: `/api/webhooks/nomadpay` and `/api/webhooks/payoneer`.
  - [ ] Add logic to both webhook listeners to automatically update `is_paid = true`, record the `payment_provider`, and store the `transaction_id` upon a successful event.
- [ ] **Task 5.4: Secure PDF Access & Dynamic Generation**
  - [ ] Build the final success UI returning the user from either checkout flow.
  - [ ] Create a secure Vercel API route `/api/download-document` that verifies the `is_paid` status.
  - [ ] Integrate `@react-pdf/renderer` or `pdf-lib` to dynamically generate the letter (injecting name, role, date, and unique code) and serve the buffer to the client.