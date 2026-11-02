package com.bookworm.estore.service;

import com.bookworm.estore.config.JwtUtil;
import com.bookworm.estore.dto.AuthDto;
import com.bookworm.estore.entity.Cart;
import com.bookworm.estore.entity.User;
import com.bookworm.estore.repository.CartRepository;
import com.bookworm.estore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .build();
        user = userRepository.save(user);

        // Create empty cart for user
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthDto.AuthResponse(token, user.getEmail(), user.getFirstName(),
                user.getId(), user.getRole().name(), user.getGiftPoints());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthDto.AuthResponse(token, user.getEmail(), user.getFirstName(),
                user.getId(), user.getRole().name(), user.getGiftPoints());
    }
}
