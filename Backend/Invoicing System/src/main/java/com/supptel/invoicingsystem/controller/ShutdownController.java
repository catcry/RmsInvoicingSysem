package com.supptel.invoicingsystem.controller;

import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ShutdownController {

    private final ApplicationContext applicationContext;

    public ShutdownController(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @PostMapping("/stop")
    public ResponseEntity<String> shutdown() {
        new Thread(() -> {
            try {
                Thread.sleep(100); // Let the HTTP response finish
                SpringApplication.exit(applicationContext, () -> 0);
                Thread.sleep(100); // Let the HTTP response finish
                System.exit(0);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
        return ResponseEntity.ok("Settlement Stop...");
    }
}