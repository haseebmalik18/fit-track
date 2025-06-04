package com.fit_track.service;

import com.fit_track.dto.request.LoginRequest;
import com.fit_track.dto.request.OnboardingRequest;
import com.fit_track.dto.request.RegisterRequest;
import com.fit_track.dto.request.VerifyEmailRequest;
import com.fit_track.dto.response.AuthResponse;
import com.fit_track.dto.response.RegisterResponse;
import com.fit_track.entity.User;
import com.fit_track.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * Service for authentication operations with email verification and onboarding.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private EmailService emailService;

    public RegisterResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmailVerified(false);
        user.setProfileCompleted(false);
        user.setEnabled(false); // Only enabled after email verification

        // Generate verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15)); // 15 minutes expiry

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), verificationCode);
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        return new RegisterResponse("Registration successful! Please check your email for verification code.",
                savedUser.getEmail());
    }

    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        // Find user by email first
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if verification code matches
        if (!request.getCode().equals(user.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        if (!user.isVerificationCodeValid()) {
            throw new RuntimeException("Verification code has expired");
        }

        // Verify email
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);

        User savedUser = userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(),
                savedUser.getFirstName(), savedUser.getLastName(),
                savedUser.isEmailVerified(), savedUser.isProfileCompleted());
    }

    public AuthResponse completeOnboarding(OnboardingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email must be verified before completing onboarding");
        }

        // Update user profile
        user.setGoal(request.getGoal());
        user.setActivityLevel(request.getActivityLevel());
        user.setCurrentWeight(request.getCurrentWeight());
        user.setTargetWeight(request.getTargetWeight());
        user.setHeight(request.getHeight());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setProfileCompleted(true);

        User savedUser = userRepository.save(user);

        // Generate new JWT token with updated info
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(),
                savedUser.getFirstName(), savedUser.getLastName(),
                savedUser.isEmailVerified(), savedUser.isProfileCompleted());
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Get user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Find user in database
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }

        // Generate JWT token
        String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt, user.getId(), user.getEmail(),
                user.getFirstName(), user.getLastName(),
                user.isEmailVerified(), user.isProfileCompleted());
    }

    public void resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        // Generate new verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email");
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }
}