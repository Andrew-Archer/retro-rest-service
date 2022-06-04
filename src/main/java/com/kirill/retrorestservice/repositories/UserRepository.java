package com.kirill.retrorestservice.repositories;

import com.kirill.retrorestservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
