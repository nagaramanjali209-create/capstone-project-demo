package com.bookworm.estore.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank private String firstName;
        private String lastName;
        @Email @NotBlank private String email;
        @Size(min = 6) @NotBlank private String password;
        private String phoneNumber;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String email;
        private String firstName;
        private Long userId;
        private String role;
        private Integer giftPoints;

        public AuthResponse(String token, String email, String firstName, Long userId, String role, Integer giftPoints) {
            this.token = token;
            this.email = email;
            this.firstName = firstName;
            this.userId = userId;
            this.role = role;
            this.giftPoints = giftPoints;
        }
    }
}
