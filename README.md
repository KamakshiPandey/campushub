# 🎓 CampusHub

CampusHub is a college-exclusive marketplace and community platform that lets verified students buy, sell, and rent items (textbooks, electronics, dorm gear), find compatible roommates, chat in real-time, and build trust through peer reviews — all within their own campus network.

Only students with a verified college email (e.g. `@gehu.ac.in`, `@geu.ac.in`) can register, keeping the community restricted to real, local students.

---

## ✨ Features

- **🔐 Authentication** — JWT-based auth with college email domain restriction and email verification (via nodemailer)
- **🛒 Listings** — Full CRUD for items with image uploads, status tracking (available/reserved/sold), and auto-expiry of stale reservations
- **🏠 Roommate Finder** — Post and browse roommate listings
- **💬 Real-time Chat** — Socket.io powered messaging tied to specific listings
- **⭐ Reviews & Ratings** — Peer reviews attached to user profiles
- **🚩 Trust & Safety** — Report users/listings, block unwanted users, admin moderation queue
- **💳 Payments** — Payment tracking tied to listings and users
- **📊 Analytics** — Admin-facing usage/activity insights
- **📧 Email Notifications** — Welcome emails, verification links, new message alerts, sale confirmations, and listing milestone alerts

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- Sequelize ORM (MySQL in production, SQLite fallback for zero-config local runs)
- Socket.io for real-time chat
- JWT for authentication
- Nodemailer for transactional email
- Helmet, CORS, express-rate-limit for security
- Multer for file uploads

**Frontend**
- React
- React Router
- Socket.io client

---

## 📁 Folder Structure
