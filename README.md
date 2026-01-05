# Log Tracking Dashboard

**Simulates real-time log monitoring for applications.**

---

## Demo

- **User Login:** Enter demo credentials to simulate login events.
- **Developer Dashboard:** View all login and system events in real time with filters for INFO, WARNING, and ERROR logs.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Spring Boot (Java)
- **APIs:** REST endpoints for logging and fetching logs
- **Build / Dependency Management:** Maven

---

## Features

- Demo login page with predefined credentials
- Backend decides log types (INFO/WARNING/ERROR)
- Real-time developer/tester dashboard
- Filter logs by type
- Backend stores logs in memory (demo purpose)

---

## How It Works

1. User attempts login using demo credentials.
2. Backend evaluates login:
   - Correct login → `[INFO]` log
   - Wrong password → `[WARNING]` log
   - 3+ consecutive failures → `[ERROR]` log
   - Backend down → `[ERROR]` log
3. Logs are displayed in the developer dashboard in real time.
4. Dashboard allows filtering by log type (INFO, WARNING, ERROR).

---

## How to Run Locally

1. Navigate to backend folder:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   
2. Navigate to frontend folder:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Author
Anmol Thakur
