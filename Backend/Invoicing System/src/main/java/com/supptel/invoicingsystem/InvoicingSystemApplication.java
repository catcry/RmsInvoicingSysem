package com.supptel.invoicingsystem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.supptel.invoicingsystem.repository")
@ComponentScan({"com.supptel.invoicingsystem.repository", "com.supptel.invoicingsystem.*"})
public class InvoicingSystemApplication {

    private static final Logger log = LoggerFactory.getLogger(InvoicingSystemApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(InvoicingSystemApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logApplicationUrl(ApplicationReadyEvent event) {
        Environment environment = event.getApplicationContext().getEnvironment();

        String port = environment.getProperty("local.server.port",
                environment.getProperty("server.port", "8443"));
        String contextPath = environment.getProperty("server.servlet.context-path", "");
        if (!contextPath.isBlank() && !contextPath.startsWith("/")) {
            contextPath = "/" + contextPath;
        }
        log.info("Application started in: http://localhost:{}{}", port, contextPath);
    }
}
