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

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }


        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmailVerified(false);
        user.setProfileCompleted(false);
        user.setEnabled(false);


        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));

        User savedUser = userRepository.save(user);


        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), verificationCode);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        return new RegisterResponse("Registration successful! Please check your email for verification code.",
                savedUser.getEmail());
    }

    public AuthResponse verifyEmail(VerifyEmailRequest request) {

        String email = request.getEmail().toLowerCase().trim();
        String code = request.getCode().trim();


        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }


        if (user.getVerificationCode() == null || user.getVerificationCode().trim().isEmpty()) {
            throw new RuntimeException("No verification code found. Please request a new one.");
        }

        // Debug logging - remove in production
        System.out.println("Stored code: '" + user.getVerificationCode() + "'");
        System.out.println("Provided code: '" + code + "'");
        System.out.println("Codes match: " + user.getVerificationCode().equals(code));
        System.out.println("Code expiry: " + user.getVerificationCodeExpiresAt());
        System.out.println("Current time: " + LocalDateTime.now());


        if (user.getVerificationCodeExpiresAt() == null ||
                LocalDateTime.now().isAfter(user.getVerificationCodeExpiresAt())) {
            throw new RuntimeException("Verification code has expired. Please request a new one.");
        }


        if (!code.equals(user.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }


        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);

        User savedUser = userRepository.save(user);


        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(),
                savedUser.getFirstName(), savedUser.getLastName(),
                savedUser.isEmailVerified(), savedUser.isProfileCompleted());
    }

    public AuthResponse completeOnboarding(OnboardingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email must be verified before completing onboarding");
        }


        user.setGoal(request.getGoal());
        user.setActivityLevel(request.getActivityLevel());
        user.setCurrentWeight(request.getCurrentWeight());
        user.setTargetWeight(request.getTargetWeight());
        user.setHeight(request.getHeight());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setProfileCompleted(true);

        User savedUser = userRepository.save(user);


        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(),
                savedUser.getFirstName(), savedUser.getLastName(),
                savedUser.isEmailVerified(), savedUser.isProfileCompleted());
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().toLowerCase().trim();


        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );


        UserDetails userDetails = (UserDetails) authentication.getPrincipal();


        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }


        String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt, user.getId(), user.getEmail(),
                user.getFirstName(), user.getLastName(),
                user.isEmailVerified(), user.isProfileCompleted());
    }

    public void resendVerificationCode(String email) {

        email = email.toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }


        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);


        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email");
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();

        int code = random.nextInt(1000000);
        return String.format("%06d", code);
    }
}