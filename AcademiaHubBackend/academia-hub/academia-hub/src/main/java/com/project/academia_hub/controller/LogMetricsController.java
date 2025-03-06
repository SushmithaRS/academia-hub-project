package com.project.academia_hub.controller;

import com.project.academia_hub.repository.LogRepository;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/log-metrics")
public class LogMetricsController {

    private final LogRepository logRepository;
    private final MeterRegistry meterRegistry;

    public LogMetricsController(LogRepository logRepository, MeterRegistry meterRegistry) {
        this.logRepository = logRepository;
        this.meterRegistry = meterRegistry;
    }

    @GetMapping("/count")
    public Map<String, Integer> getLogCounts() {
        List<Object[]> logCounts = logRepository.countLogsByAction();
        Map<String, Integer> result = new HashMap<>();

        for (Object[] entry : logCounts) {
            String action = (String) entry[0];
            int count = ((Number) entry[1]).intValue();
            result.put(action, count);

            // Register metrics dynamically for each action type
            meterRegistry.counter("logs_count", "action", action).increment(count);
        }

        return result;
    }
}
