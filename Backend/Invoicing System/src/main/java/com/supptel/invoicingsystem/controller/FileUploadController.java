package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.service.InboundStatementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileUploadController {

    private final InboundStatementService inboundStatementService;

    public FileUploadController(InboundStatementService inboundStatementService) {
        this.inboundStatementService = inboundStatementService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/api/upload-csv")
    public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {
        String uploadResponse = inboundStatementService.uploadInboundsFile(file);
        if ("No file uploaded".equals(uploadResponse)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(uploadResponse);
        } else if ("Error processing file".equals(uploadResponse)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(uploadResponse);
        }
        return ResponseEntity.ok(uploadResponse);
    }
}