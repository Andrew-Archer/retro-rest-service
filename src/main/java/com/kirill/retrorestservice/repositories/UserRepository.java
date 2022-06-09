package com.kirill.retrorestservice.repositories;

import com.kirill.retrorestservice.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    @Nullable
    User getByEmail(String email);

    void deleteByEmail(String email);
}

