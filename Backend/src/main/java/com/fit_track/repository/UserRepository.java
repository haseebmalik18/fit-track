package com.fit_track.repository;

import com.fit_track.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);


    Optional<User> findByVerificationCode(String verificationCode);


    boolean existsByEmail(String email);
}