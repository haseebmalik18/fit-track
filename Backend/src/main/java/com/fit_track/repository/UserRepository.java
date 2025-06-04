package com.fit_track.repository;

import com.fit_track.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity with email-based authentication.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address.
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by verification code.
     */
    Optional<User> findByVerificationCode(String verificationCode);

    /**
     * Check if email already exists.
     */
    boolean existsByEmail(String email);
}