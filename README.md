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
campushub/
├── server/
│   ├── config/
│   │   └── database.js          # Sequelize connection (MySQL/SQLite)
│   ├── controllers/
│   │   ├── authController.js    # Register, login, email verification, profile
│   │   ├── reportController.js  # Reports & user blocking
│   │   └── ...                  # listing, roommate, chat, review, admin, payment, analytics
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect + admin guard
│   │   ├── errorMiddleware.js   # notFound + centralized error handler
│   │   ├── uploadMiddleware.js  # Multer config for image uploads
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Roommate.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Review.js
│   │   ├── Payment.js
│   │   ├── Report.js
│   │   ├── BlockedUser.js
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── roommateRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── reportRoutes.js
│   ├── services/
│   │   └── emailService.js      # All transactional email templates
│   ├── socket/
│   │   └── socketHandler.js     # Real-time chat event handling
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── logger.js
│   ├── uploads/                 # User-uploaded images (gitignored except default avatar)
│   ├── .env                     # Environment config (never committed)
│   └── server.js                # App entry point
│
├── client/                      # React frontend
│   ├── src/
│   └── ...
│
├── .gitignore
└── README.md
---

## ⚙️ Environment Variables

Create a `server/.env` file with the following:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=campushub_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=no-reply@campushub.com
FROM_NAME=CampusHub Team

COLLEGE_EMAIL_DOMAINS=@gehu.ac.in,@geu.ac.in
```

> ⚠️ Never commit `.env` — it's excluded via `.gitignore`. `DB_DIALECT` can be omitted to fall back to a local SQLite file for zero-config setup.

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/campushub.git
cd campushub
```

### 2. Set up the backend
```bash
cd server
npm install
# create and fill in .env as shown above
npm run dev
```
The API will start on `http://localhost:5000`.

### 3. Set up the frontend
```bash
cd client
npm install
npm start
```
The app will open on `http://localhost:3000`.

### 4. Create the database
If using MySQL, create the database before starting the server:
```sql
CREATE DATABASE campushub_db;
```
Sequelize will automatically create/sync all tables on server startup.

---

## 🔑 Authentication Flow

1. User registers with a college email matching one of `COLLEGE_EMAIL_DOMAINS`
2. A verification email is sent with a time-limited token link
3. User must verify their email before they're allowed to log in
4. On login, a JWT is issued and used to authorize protected routes

---

## 🤝 Contributing

This is currently a solo/student project. Suggestions and issues are welcome via GitHub Issues.

## 📄 License

Not yet licensed — all rights reserved by the project author unless stated otherwise.
