package com.project.academia_hub.service;

import com.project.academia_hub.model.Log;
import com.project.academia_hub.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LogService {

    private final LogRepository logRepository;

    @Autowired
    public LogService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void logAction(String username, String action, String details, LocalDateTime timestamp) {
        Log log = new Log(username, action, details, timestamp);
        logRepository.save(log);
    }
}
