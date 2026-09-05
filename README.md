# Student Management System

A fullstack Student Management application with a **Spring Boot** REST API, **MySQL** database, and a clean, basic **React** frontend.

---

## Project Structure

```
springboot/
├── backend/    # Spring Boot REST API & MySQL Hibernate JPA
└── frontend/   # Basic React frontend (Vite)
```

---

## How to Run and Edit MySQL

### 1. Starting MySQL Server

#### On Windows:
- **If installed via the installer (C:\Program Files\MySQL\MySQL Server 8.4\bin)**:
  ```powershell
  # Start MySQL server in background:
  & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\my.ini" --console
  ```
- **If running as a Windows Service**:
  ```powershell
  net start MySQL
  ```

#### On macOS:
```bash
# Start MySQL with Homebrew
brew services start mysql

# Or manually:
mysql.server start
```

---

### 2. Stopping MySQL Server

#### On Windows:
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin.exe" -u root shutdown
```
*(Or if running as service: `net stop MySQL`)*

#### On macOS:
```bash
brew services stop mysql
# Or:
mysql.server stop
```

---

### 3. Checking MySQL Status

```bash
# Check if MySQL is alive
mysqladmin -u root ping
```
*(If it returns `mysqld is alive`, the server is running successfully).*

---

### 4. How to Connect and Edit MySQL Data

#### Option A: Using the Command Line (CLI)

1. **Connect to MySQL**:
   ```bash
   mysql -u root
   ```
   *(If you set a password, use `mysql -u root -p`)*

2. **Select the Database**:
   ```sql
   USE student_management_db;
   ```

3. **View All Students**:
   ```sql
   SELECT * FROM students;
   ```

4. **Insert / Add a Student**:
   ```sql
   INSERT INTO students (name, email, course, marks)
   VALUES ('Alex Turner', 'alex@example.com', 'Computer Science', 92);
   ```

5. **Edit / Update a Student Record**:
   ```sql
   -- Update marks for student with ID 1
   UPDATE students SET marks = 95 WHERE id = 1;

   -- Update course and name for student with ID 1
   UPDATE students SET course = 'Data Science', name = 'Alexander Turner' WHERE id = 1;
   ```

6. **Delete a Student Record**:
   ```sql
   DELETE FROM students WHERE id = 1;
   ```

7. **Exit MySQL CLI**:
   ```sql
   EXIT;
   ```

---

#### Option B: Using a GUI Tool (MySQL Workbench, DBeaver, or VS Code)

You can connect with any MySQL GUI tool (such as **DBeaver**, **MySQL Workbench**, or the **Database Client** VS Code extension) using these connection parameters:

| Parameter | Value |
|---|---|
| **Host** | `localhost` (or `127.0.0.1`) |
| **Port** | `3306` |
| **Database** | `student_management_db` |
| **Username** | `root` |
| **Password** | *(leave blank if no password was set, or enter your root password)* |

---

### 5. Editing MySQL Connection Settings in the Project

The backend database configuration is stored in:
📁 **`backend/src/main/resources/application.properties`**

To change the database credentials, update these lines:
```properties
# Database URL, Username, and Password
spring.datasource.url=jdbc:mysql://localhost:3306/student_management_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## How to Run Backend (Spring Boot)

In your terminal:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows: `.\mvnw.cmd spring-boot:run`)*

The backend will start on **`http://localhost:8080`**.

---

## How to Run Frontend (React)

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173`** (or `http://localhost:5174`).

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students (supports optional `?name=` or `?course=`) |
| `GET` | `/api/students/{id}` | Get student by ID |
| `POST` | `/api/students` | Create new student |
| `PUT` | `/api/students/{id}` | Update student by ID |
| `DELETE` | `/api/students/{id}` | Delete student by ID |
| `GET` | `/api/students/course/{course}` | Filter students by course |
