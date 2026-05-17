# Smart Loan Lifecycle Management System 🏦

A modern, production-ready fintech web application for end-to-end loan management. Built with the PERN stack (PostgreSQL, Express, React, Node.js) and integrated with Stripe for payments.

## ✨ Features

- **End-to-End Loan Lifecycle**: From online application to final repayment.
- **Role-Based Access Control**:
  - **Borrower**: Apply for loans, upload KYC, track status, pay EMIs.
  - **Loan Officer**: Review applications, verify documents, approve/reject.
  - **Admin**: System-wide analytics, user management, defaulter monitoring.
- **Financial Tools**: Automatic EMI calculation and schedule generation.
- **Payments**: Integrated Stripe payment gateway for secure EMI repayments.
- **Reporting**: Dynamic PDF generation for sanction letters, EMI statements, and receipts.
- **Analytics**: Visual dashboards using Recharts for data-driven insights.
- **UX/UI**: Modern banking-grade design with glassmorphism, responsive layouts, and dark mode.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16+
- **PostgreSQL**: Local instance or Supabase
- **Stripe Account**: For payment integration

### Installation

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Environment Configuration**:
   Create `.env` files in both `backend` and `frontend` folders using the provided templates.

3. **Database Setup**:
   Ensure PostgreSQL is running, then seed the database with sample data:
   ```bash
   npm run seed
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@loansystem.com` | `admin123` |
| **Loan Officer** | `officer@loansystem.com` | `officer123` |
| **Borrower** | `amit@example.com` | `borrower123` |

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Redux Toolkit, Recharts, jsPDF, Stripe Elements.
- **Backend**: Node.js, Express.js, JWT, Bcrypt.js, Multer.
- **Database**: PostgreSQL (pg), Express.
- **Integrations**: Stripe API, Nodemailer (optional).

## 📄 Documentation

- [PRD (Product Requirements Document)](./prd)
- [TRD (Technical Requirements Document)](./trd)

---
Developed with ❤️ for NBFCs and Modern Banking.
