# Student Management Fullstack Application

A fullstack application with a **Spring Boot 4** backend, **Hibernate JPA**, **MySQL 8.4 (LTS)** database, and a **React 18** frontend (powered by **Vite**).

---

## Project Structure

```
springboot/
├── backend/                       # Spring Boot 4 REST API
│   ├── src/
│   │   ├── main/java/com/example/student_management/
│   │   │   ├── controller/        # StudentController (REST endpoints)
│   │   │   ├── entity/            # Student (JPA Entity with validations)
│   │   │   ├── repository/        # StudentRepository (Spring Data JPA)
│   │   │   ├── services/          # StudentServices (Business logic)
│   │   │   ├── exception/         # GlobalExceptionHandler, Custom Exceptions
│   │   │   └── StudentManagementApplication.java
│   │   └── resources/
│   │       └── application.properties # MySQL DataSource & Hibernate config
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── frontend/                      # React 18 Application
│   ├── src/
│   │   ├── services/studentApi.js # API client connecting to backend
│   │   ├── App.jsx                # Main React dashboard component
│   │   ├── index.css              # Custom styling tokens and layout
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   ├── vite.config.js             # Vite config with backend proxy (:8080)
│   └── index.html
│
├── start-all.sh / .bat            # One-click launcher for MySQL, Backend & Frontend
├── start-backend.sh / .bat        # Quick launcher for Spring Boot
├── start-frontend.sh / .bat       # Quick launcher for React Vite
├── start-mysql.sh / .bat          # Quick launcher for MySQL server
└── stop-mysql.sh / .bat           # Graceful shutdown for MySQL server
```

---

## Running on macOS

### 1. Prerequisites (macOS)
Install MySQL and Node.js (if not already installed via Homebrew):
```bash
brew install mysql node
brew services start mysql
```

Ensure MySQL has the database created:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS student_management_db;"
```

### 2. Start Fullstack App (macOS)
```bash
chmod +x *.sh backend/mvnw
./start-all.sh
```

Or run services individually:
- **Start Backend**: `./start-backend.sh` (or `cd backend && ./mvnw spring-boot:run`) -> `http://localhost:8080`
- **Start Frontend**: `./start-frontend.sh` (or `cd frontend && npm install && npm run dev`) -> `http://localhost:5173`

---

## Running on Windows

### Quick Start (Windows)
Double-click `start-all.bat` or execute in PowerShell:
```powershell
.\start-all.bat
```

Or run services individually:
- **Start MySQL**: `.\start-mysql.bat`
- **Start Backend**: `.\start-backend.bat`
- **Start Frontend**: `.\start-frontend.bat`

---

## Features
- **Real-time Stat Cards**: Total Students, Average Marks, Top Marks, Active Courses.
- **Full CRUD Support**: Add, view, edit, and delete student records.
- **Search & Filter**: Instant search by student name/email and course dropdown filter.
- **Validation**: Strict validation on backend and client-side (mandatory fields, valid email format, marks 0–100).
- **MySQL Persistence**: Full relational database persistence in MySQL 8.4 (`student_management_db`).
- **REST APIs**: Clean RESTful endpoints under `/api/students`.
