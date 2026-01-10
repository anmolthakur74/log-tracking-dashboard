package com.example.logmonitor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/logs")
@CrossOrigin(origins = "*")
public class LogController {

    // In-memory storage for logs
    private final List<Map<String, String>> logs = Collections.synchronizedList(new ArrayList<>());

    // Track failed login attempts per user
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();

    // Demo credentials
    private final String DEMO_USERNAME = "demoUser";
    private final String DEMO_PASSWORD = "demoPass123";

    private final int MAX_LOGS = 500; // optional log limit

    // -----------------------
    // GET logs
    // -----------------------
    @GetMapping
    public List<Map<String, String>> getLogs(@RequestParam(defaultValue = "50") int limit) {
        int size = logs.size();
        int fromIndex = Math.max(0, size - limit);
        return logs.subList(fromIndex, size);
    }

    // -----------------------
    // POST login
    // -----------------------
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> payload) {
        String username = payload.getOrDefault("username", "Unknown");
        String password = payload.getOrDefault("password", "");

        Map<String, String> response = new HashMap<>();
        String logMessage;
        String logLevel;

        try {
            if (DEMO_USERNAME.equals(username) && DEMO_PASSWORD.equals(password)) {
                logLevel = "INFO";
                logMessage = String.format("[%s] User %s logged in successfully", logLevel, username);
                failedAttempts.put(username, 0); // reset failed attempts
                response.put("status", "success");
                response.put("message", "Login successful!");
            } else {
                int attempts = failedAttempts.getOrDefault(username, 0) + 1;
                failedAttempts.put(username, attempts);

                logLevel = (attempts >= 3) ? "ERROR" : "WARNING";
                logMessage = String.format("[%s] Failed login attempt by %s", logLevel, username);
                response.put("status", "error");
                response.put("message", "Invalid credentials!");
            }

            saveLog(logMessage);

        } catch (Exception e) {
            String errorLog = String.format("[ERROR] Backend failed to log for %s: %s", username, e.getMessage());
            saveLog(errorLog);
        }

        return response;
    }

    // -----------------------
    // POST frontend logs (queued)
    // -----------------------
    @PostMapping("/frontend-log")
    public Map<String, String> receiveFrontendLog(@RequestBody Map<String, String> log) {
        String timestamp = log.getOrDefault("timestamp", now());
        String message = log.getOrDefault("message", "[ERROR] Unknown frontend log");

        Map<String, String> logEntry = new HashMap<>();
        logEntry.put("timestamp", timestamp);
        logEntry.put("message", message);

        logs.add(logEntry);
        trimLogs();

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        return response;
    }

    // -----------------------
    // Helper to save logs
    // -----------------------
    private void saveLog(String message) {
        Map<String, String> logEntry = new HashMap<>();
        logEntry.put("timestamp", now());
        logEntry.put("message", message);
        logs.add(logEntry);
        trimLogs();
    }

    // -----------------------
    // Helper: current timestamp
    // -----------------------
    private String now() {
        return LocalDateTime.now().toString();
    }

    // -----------------------
    // Optional: limit log size
    // -----------------------
    private void trimLogs() {
        if (logs.size() > MAX_LOGS) {
            logs.subList(0, logs.size() - MAX_LOGS).clear();
        }
    }
}
