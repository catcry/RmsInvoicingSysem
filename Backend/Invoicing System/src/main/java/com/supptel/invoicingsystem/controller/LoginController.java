package com.supptel.invoicingsystem.controller;

import com.supptel.invoicingsystem.record.AccountCredentialRecord;
import com.supptel.invoicingsystem.service.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	private final JwtUtil jwtService;
	private final AuthenticationManager authenticationManager;

	public LoginController(JwtUtil jwtService, AuthenticationManager authenticationManager) {
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}

	@PostMapping("/login")
	public ResponseEntity<String> getToken(@RequestBody AccountCredentialRecord credentials) {
		UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(credentials.username(),
				credentials.password());
		Authentication auth = authenticationManager.authenticate(creds);
		String jwts = jwtService.generateToken(auth.getName());

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + jwts);
		headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
		return ResponseEntity.ok().headers(headers).body("{\"token\": \"" + jwts + "\" }");
	}
}