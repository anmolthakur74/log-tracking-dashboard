package com.example.logmonitor;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        System.err.println("[ERROR] Backend exception: " + ex.getMessage());
        return ResponseEntity.status(500).body("Internal server error");
    }
}
