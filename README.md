
# 📝 Online Quiz Evaluation System

A full-stack MERN-based Online Quiz Evaluation System developed as part of the Full Stack Development (FSD-2) course.

## 🚀 Features

### Authentication

* User Registration
* Email OTP Verification
* Login using JWT Authentication
* Role-Based Access (Admin & Student)

### Student Module

* View Available Quizzes
* Start Quiz
* Attempt Questions
* Submit Quiz
* Automatic Score Calculation
* View Result

### Admin Module

* Admin Login
* Create Quiz
* Add Questions
* View Quiz Results
* Manage Quizzes

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap
* Vite

### Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer

### Database

* MongoDB Atlas
* Mongoose

---

## 📂 Project Structure

```text
Online-Quiz-Evaluation-System
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seedAdmins.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── screenshots/
│   ├── home.png
│   ├── register.png
│   ├── student-dashboard.png
│   └── quiz.png
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/pallavigudla/Online-Quiz-Evaluation-System.git
cd Online-Quiz-Evaluation-System
```

### Backend Setup

Open a terminal and run:

```bash
cd Backend
npm install
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

### Frontend Setup

Open a **new terminal** and run:

```bash
cd Frontend
npm install
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `Backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
PORT=5000
## 📸 Screenshots

### 🏠 Home Page

<p align="center">
  <img src="home.png" alt="Home Page" width="800">
</p>
### 📝 Login  Page
<p align="center">
  <img src="Login.png" alt="Home Page" width="800">
</p>
### 📝 Register Page

<p align="center">
  <img src="register.png" alt="Register Page" width="800">
</p>

### 👨‍🎓 Student Dashboard

<p align="center">
  <img src="student-dashboard.png" alt="Student Dashboard" width="800">
</p>

### 📝 Admin Dashboard

<p align="center">
  <img src="AdminDashboard.png" alt="Quiz Page" width="800">
</p>

---

## 👨‍💻 Team Members

| Name        | Role      |
| ------------| --------- |
| Jhansi Rani | Developer |
| Surendra    | Developer |
| Pallavi Siri| Developer |
| Sanjay Kumar| Developer |
| Siva Shankar| Developer |

---

## 📚 Academic Project

**Course:** Full Stack Development (FSD-2)

**Technology:** MERN Stack

**Institution:** Sri Vasavi Engineering College

---

## ⭐ Future Enhancements

* Timer for Quiz
* Leaderboard
* Certificate Generation
* Quiz Analytics
* Responsive UI
* Dark Mode

---

## 📄 License

This project is developed for educational purposes.
