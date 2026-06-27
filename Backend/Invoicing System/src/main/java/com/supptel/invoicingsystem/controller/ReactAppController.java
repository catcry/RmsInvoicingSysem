package com.supptel.invoicingsystem.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReactAppController {
    @GetMapping("/{path:[^.]*}")
    public ResponseEntity<Resource> serveReactApp(@PathVariable String path) {
        Resource indexHtml = new ClassPathResource("/static/index.html");
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(indexHtml);
    }
}