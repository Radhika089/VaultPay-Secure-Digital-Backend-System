# 💳 VaultPay — Secure Digital Payment Backend

> A production-ready backend that simulates how modern digital payment systems handle authentication, account management, secure money transfers, and transaction recording.

![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Render](https://img.shields.io/badge/Deployment-Render-blueviolet)

---

## 🚀 Live API

🔗 **Backend:** https://vaultpay-secure-digital-backend-system.onrender.com/

---

# 📖 About the Project

VaultPay is a secure digital payment backend inspired by real-world fintech systems. It demonstrates how banking and payment applications securely authenticate users, create accounts, process money transfers, maintain a transaction ledger, and prevent duplicate payments using idempotency.

The project focuses on backend architecture, secure API design, and transactional consistency rather than UI.

Instead of simply transferring money between users, every transaction is recorded in a ledger to provide an auditable history of account activity, following concepts used in financial systems.

---

# ✨ Features

### 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing with Bcrypt
- Protected Routes
- Secure Logout

---

### 🏦 Account Management

- Create Digital Account
- Account Status Management
- Account Balance Calculation
- User Account Retrieval

---

### 💸 Transaction System

- Secure Money Transfer
- Initial Account Funding
- Transaction Status Tracking
- Duplicate Transaction Prevention (Idempotency)
- Pending / Completed / Failed Transaction Handling

---

### 📒 Ledger System

Every transfer automatically creates:

- Debit Ledger Entry
- Credit Ledger Entry

This follows the **Double Entry Ledger** concept used in banking systems.

---

### 📧 Email Notifications

- Welcome Email
- Transaction Notification Email

---

### ☁️ Deployment

- MongoDB Atlas
- Render
- Environment Variable Configuration
- Production Ready API

---

# 🛠 Tech Stack

| Category            | Technology          |
| ------------------- | ------------------- |
| Runtime             | Node.js             |
| Framework           | Express.js          |
| Database            | MongoDB Atlas       |
| ODM                 | Mongoose            |
| Authentication      | JWT                 |
| Password Encryption | Bcrypt              |
| Email Service       | Nodemailer / Resend |
| Deployment          | Render              |

---

# 📁 Project Structure

```
backend
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── app.js
│
├── server.js
├── package.json
└── .env
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGODB_URI=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=

RESEND_API_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REFRESH_TOKEN=

GOOGLE_REDIRECT_URI=
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| GET    | `/api/auth/profile`  |
| POST   | `/api/auth/logout`   |

---

## Account

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/account/create` |
| GET    | `/api/account/me`     |

---

## Transactions

| Method | Endpoint                          |
| ------ | --------------------------------- |
| POST   | `/api/transactions`               |
| POST   | `/api/transactions/initial-funds` |
| GET    | `/api/transactions/history`       |

---

# 🔄 How a Transaction Works

```
User Login
      │
      ▼
JWT Authentication
      │
      ▼
Validate Accounts
      │
      ▼
Check Balance
      │
      ▼
Prevent Duplicate Requests
(Idempotency)
      │
      ▼
Create Pending Transaction
      │
      ▼
Debit Sender Account
      │
      ▼
Credit Receiver Account
      │
      ▼
Create Ledger Entries
      │
      ▼
Mark Transaction Completed
      │
      ▼
Send Email Notification
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Radhika089/VaultPay-Secure-Digital-Backend-System.git
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Run Production Server

```bash
npm start
```

---

# 🎯 Learning Highlights

This project demonstrates practical backend concepts including:

- REST API Development
- JWT Authentication
- Express Middleware
- MongoDB Transactions
- Mongoose Sessions
- Double Entry Ledger
- Idempotency
- Environment Variables
- Error Handling
- Production Deployment
- Secure Backend Architecture

---

# 📈 Future Improvements

- React Frontend
- Admin Dashboard
- User Dashboard
- Transaction Analytics
- OTP Verification
- Rate Limiting
- Refresh Token Authentication
- Docker Support
- CI/CD Pipeline
- API Documentation (Swagger)

---

# 👩‍💻 Author

**Radhika Bansal**

- 💼 Aspiring Full-Stack Developer
- 🌱 Currently learning MERN Stack
- 🚀 Building projects in public

GitHub: https://github.com/Radhika089

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.
