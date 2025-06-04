package com.fit_track.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify Your FitTrack Account");
        message.setText(String.format(
                "Welcome to FitTrack!\n\n" +
                        "Your verification code is: %s\n\n" +
                        "This code will expire in 15 minutes.\n\n" +
                        "If you didn't create an account with us, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "The FitTrack Team",
                verificationCode
        ));
        message.setFrom("noreply@fittrack.com");

        try {
            mailSender.send(message);
            System.out.println("Verification email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendWelcomeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to FitTrack!");
        message.setText(String.format(
                "Hi %s,\n\n" +
                        "Welcome to FitTrack! Your email has been verified successfully.\n\n" +
                        "You can now start tracking your fitness journey and achieving your goals.\n\n" +
                        "Get started by:\n" +
                        "• Setting up your profile\n" +
                        "• Logging your first workout\n" +
                        "• Tracking your nutrition\n\n" +
                        "Best regards,\n" +
                        "The FitTrack Team",
                firstName
        ));
        message.setFrom("noreply@fittrack.com");

        try {
            mailSender.send(message);
            System.out.println("Welcome email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + toEmail + ": " + e.getMessage());
            // Don't throw exception for welcome email failure
        }
    }
}