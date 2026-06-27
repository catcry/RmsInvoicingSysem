package com.supptel.invoicingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.supptel.invoicingsystem.repository")
@ComponentScan({"com.supptel.invoicingsystem.repository", "com.supptel.invoicingsystem.*"})
public class InvoicingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(InvoicingSystemApplication.class, args);
    }
}
