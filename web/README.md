# Eurovanta Talent Recruitment Platform

Welcome to the **Eurovanta Talent** Recruitment Platform repository. 

Eurovanta Talent is a state-of-the-art recruitment portal designed to streamline international hiring. It provides an end-to-end ecosystem connecting top-tier global talent with high-demand European and Middle-Eastern employers. The platform guarantees security, immutability, and efficiency through a cryptographically secured verification portal and real-time backend synchronization.

---

## 🛠 Tech Stack

This project leverages a high-performance, modern, serverless architecture:

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (React)
*   **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism design system)
*   **Database:** [Neon PostgreSQL](https://neon.tech/) (Serverless Postgres)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Email & Comms:** [Brevo](https://www.brevo.com/) (Transactional Emails)
*   **Document Processing:** `pdf-lib` (Cryptographic verification and watermarking)
*   **Payments:** Integrations configured for Nomadpay & Payoneer 

---

## 🔐 Environment Variables

To run this application locally, you must create a `.env` file in the root of the project. Do not commit your real `.env` to version control. 

Please copy the following template and populate it with your specific secret keys:

```env
# Database configuration
DATABASE_URL=""

# Authentication secret for JWT tokens
JWT_SECRET=""

# Email Configuration
BREVO_API_KEY=""

# Payment Gateway Secrets
PAYONEER_SECRET=""
NOMADPAY_KEY=""
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to get your local development environment running:

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on the template above and add your `DATABASE_URL` (from your Neon dashboard) and a highly secure `JWT_SECRET`.

### 3. Database Synchronization (Prisma)
Push the Prisma schema to your connected Neon database. This command will also generate the Prisma client automatically.
```bash
npx prisma db push
```
*(Optional)* If you wish to use Prisma Studio to explore your data:
```bash
npx prisma studio
```

### 4. Start Development Server
Run the Next.js development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 🏗 Build for Production

To create an optimized production build (and verify that there are no lingering TypeScript errors before deploying to Vercel):
```bash
npm run build
```
You can then simulate the production environment locally using:
```bash
npm start
```

---

*© 2026 Eurovanta Talent Talent Solutions. All rights reserved.*
