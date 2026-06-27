package com.supptel.invoicingsystem.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class ConsoleStopper implements CommandLineRunner {
    private final Logger logger = LoggerFactory.getLogger(ConsoleStopper.class);
    private final ApplicationContext applicationContext;
    public ConsoleStopper(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
    @Override
    public void run(String... args) {
        new Thread(() -> {
            Scanner scanner = new Scanner(System.in);
            while (true) {
                String line = scanner.nextLine();
                if ("exit".equalsIgnoreCase(line) || "quit".equalsIgnoreCase(line)) {
                    logger.info("Shutting down by user command...");
                    SpringApplication.exit(applicationContext, () -> 0);
                    System.exit(0);
                    break;
                }
            }
        }).start();
    }
}
