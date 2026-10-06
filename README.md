# 📝 Online Quiz Evaluation System

A full-stack MERN-based Online Quiz Evaluation System developed as part of the Full Stack Development (FSD-2) course.

## 🚀 Features

### Authentication
- User Registration
- Email OTP Verification
- Login using JWT Authentication
- Role-Based Access (Admin & Student)

### Student Module
- View Available Quizzes
- Start Quiz
- Attempt Questions
- Submit Quiz
- Automatic Score Calculation
- View Result

### Admin Module
- Admin Login
- Create Quiz
- Add Questions
- View Quiz Results
- Manage Quizzes

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap
- Vite

### Backend
- Node.js
- Express.js
- JWT Authentication
- Nodemailer

### Database
- MongoDB Atlas
- Mongoose

---

## 📂 Project Structure

```bash
online-quiz-portal
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── .gitignore
├── README.md
├── Screenshots/
│   ├── Home.png
│   ├── Login.png
│   ├── Register.png
│   ├── StudentDashboard.png
│   └── AdminDashboard.png
└── package.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/SURENDRATHONTA/online-quiz-portal.git
cd online-quiz-portal
```

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
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
```

---

## 📸 Screenshots

### Home Page
![Home Page](Screenshots/Home.png)

### Register Page
![Register Page](Screenshots/Register.png)

### Login Page
![Login Page](Screenshots/Login.png)

### Student Dashboard
![Student Dashboard](Screenshots/StudentDashboard.png)

### Admin Dashboard
![Admin Dashboard](Screenshots/AdminDashboard.png)

---

## 👨‍💻 Team Members

| Name | Role |
|------|------|
| Surendra Thonta | Developer |
| Sanjay Kumar Vadali | Developer |
| Shankar Palli | Developer |
| Jhansi Kagani | Developer |
| Pallavi Siri Gudla | Developer |

---

## 📚 Academic Project

**Course:** Full Stack Development (FSD-2)

**Technology:** MERN Stack

**Institution:** Sri Vasavi Engineering College

---

## ⭐ Future Enhancements

- Timer for Quiz
- Leaderboard
- Certificate Generation
- Quiz Analytics
- Responsive UI
- Dark Mode

---

## 📄 License

This project is developed for educational purposes.
