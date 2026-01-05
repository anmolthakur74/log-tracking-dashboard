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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    // Get logs
    @GetMapping
    public List<Map<String, String>> getLogs(@RequestParam(defaultValue = "50") int limit) {
        int size = logs.size();
        int fromIndex = Math.max(0, size - limit);
        return logs.subList(fromIndex, size);
    }

    // Login endpoint: frontend sends username + password
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> payload) {
        String username = payload.getOrDefault("username", "Unknown");
        String password = payload.getOrDefault("password", "");

        Map<String, String> response = new HashMap<>();
        String logMessage;
        String logLevel;

        // Check credentials
        if (DEMO_USERNAME.equals(username) && DEMO_PASSWORD.equals(password)) {
            // Successful login
            logLevel = "INFO";
            logMessage = String.format("[%s] User %s logged in successfully", logLevel, username);
            failedAttempts.put(username, 0); // reset failed attempts
            response.put("status", "success");
            response.put("message", "Login successful!");
        } else {
            // Failed login
            int attempts = failedAttempts.getOrDefault(username, 0) + 1;
            failedAttempts.put(username, attempts);

            if (attempts >= 3) {
                logLevel = "ERROR"; // 3+ fails → ERROR
            } else {
                logLevel = "WARNING"; // first or second fail → WARNING
            }

            logMessage = String.format("[%s] Failed login attempt by %s", logLevel, username);
            response.put("status", "error");
            response.put("message", "Invalid credentials!");
        }

        // Save log
        try {
            Map<String, String> logEntry = new HashMap<>();
            logEntry.put("timestamp", LocalDateTime.now().toString());
            logEntry.put("message", logMessage);
            logs.add(logEntry);
        } catch (Exception e) {
            // If backend fails to store log
            Map<String, String> logEntry = new HashMap<>();
            logEntry.put("timestamp", LocalDateTime.now().toString());
            logEntry.put("message", String.format("[ERROR] Backend failed to log for %s", username));
            logs.add(logEntry);
        }

        return response;
    }
}
