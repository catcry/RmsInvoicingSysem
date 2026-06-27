package com.supptel.invoicingsystem.config;

import com.supptel.invoicingsystem.entity.UserEntity;
import com.supptel.invoicingsystem.repository.UserRepository;
import com.supptel.invoicingsystem.service.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);
	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;

	@Autowired
    public AuthenticationFilter(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
	protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
			throws ServletException, IOException {

		final String requestTokenHeader = request.getHeader("Authorization");

		String username = null;
		String jwtToken = null;

		logger.info(">>> [AUTH] URI: {} | Has Auth Header: {}", request.getRequestURI(), requestTokenHeader != null);

		if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
			jwtToken = requestTokenHeader.substring(7);
			logger.info(">>> [AUTH] Token found, extracting username...");
			try {
				username = jwtUtil.getUsernameFromToken(jwtToken);
				logger.info(">>> [AUTH] Username extracted: {}", username);
			} catch (IllegalArgumentException e) {
				logger.error(">>> [AUTH] Unable to get JWT Token: {}", e.getMessage());
			} catch (ExpiredJwtException e) {
				logger.error(">>> [AUTH] JWT Token has expired: {}", e.getMessage());
			} catch (SignatureException e) {
				logger.error(">>> [AUTH] JWT signature does not match: {}", e.getMessage());
			}
		} else {
			logger.warn(">>> [AUTH] No Bearer token in request header!");
		}

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			logger.info(">>> [AUTH] Looking up user in DB: {}", username);
			UserEntity userDetails = this.userRepository.findByUsername(username).orElse(null);

			if (userDetails == null) {
				logger.error(">>> [AUTH] User NOT found in DB: {}", username);
			} else {
				logger.info(">>> [AUTH] User found: {}", userDetails.getUsername());
				boolean isValid = jwtUtil.validateToken(jwtToken, userDetails.getUsername());
				logger.info(">>> [AUTH] Token valid: {}", isValid);

				if (isValid) {
					List<GrantedAuthority> authorities = userDetails.getRoles().stream()
							.map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
							.collect(Collectors.toList());
					logger.info(">>> [AUTH] Authorities: {}", authorities);

					UsernamePasswordAuthenticationToken authToken =
							new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
					logger.info(">>> [AUTH] Authentication set successfully for: {}", username);
				}
			}
		} else if (username == null) {
			logger.warn(">>> [AUTH] Username is null — token missing or invalid");
		} else {
			logger.info(">>> [AUTH] Authentication already exists in context");
		}

		chain.doFilter(request, response);
	}

}