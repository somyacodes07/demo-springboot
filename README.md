# Student Management System

A fullstack Student Management application with a **Spring Boot** REST API, **MySQL** database, and a basic, clean **React** frontend.

---

## Project Structure

```
springboot/
├── backend/    # Spring Boot REST API & MySQL Hibernate JPA
└── frontend/   # Basic React frontend (Vite)
```

---

## Getting Started

### 1. Database Setup (MySQL)
Make sure MySQL is running on `localhost:3306` with the database created:
```sql
CREATE DATABASE IF NOT EXISTS student_management_db;
```
Database credentials are in `backend/src/main/resources/application.properties`.

---

### 2. Run Backend (Spring Boot)
In terminal:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows: `.\mvnw.cmd spring-boot:run`)*

The backend will start at **`http://localhost:8080`**.

---

### 3. Run Frontend (React)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **`http://localhost:5173`** (or `http://localhost:5174`).

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students (optional `?name=` or `?course=`) |
| `GET` | `/api/students/{id}` | Get student by ID |
| `POST` | `/api/students` | Create new student |
| `PUT` | `/api/students/{id}` | Update student by ID |
| `DELETE` | `/api/students/{id}` | Delete student by ID |
| `GET` | `/api/students/course/{course}` | Get students by course |
