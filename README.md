# LogMonitor

Simulates real-time log monitoring for applications. Users can log in using demo credentials, and developers/testers can view and filter system events in real time. 

## Demo
- **User Login:** Enter demo credentials to simulate login events.  
- **Developer Dashboard:** View all login and system events in real time with filters for INFO, WARNING, and ERROR logs.  

**Live Demo:** [https://logmonitor.netlify.app/](https://logmonitor.netlify.app/)  

## Tech Stack
- **Frontend:** React.js  
- **Backend:** Spring Boot (Java)  
- **APIs:** REST endpoints for logging and fetching logs  
- **Build / Dependency Management:** Maven  
- **Deployment:** Docker (backend), Netlify (frontend)

## Features
- Demo login page with predefined credentials (`demoUser` / `demoPass123`)  
- Backend evaluates login attempts and generates `[INFO]`, `[WARNING]`, `[ERROR]` logs  
- Real-time developer/tester dashboard with filtering by log type  
- Backend stores logs in memory for demo purposes
- Handles backend downtime gracefully (friendly messages on frontend)

## How It Works
1. User attempts login using demo credentials.  
2. Backend evaluates login:  
   - Correct login → `[INFO]` log  
   - Wrong password → `[WARNING]` log  
   - 3+ consecutive failures → `[ERROR]` log
3. Logs are displayed in real time on the developer dashboard.

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
