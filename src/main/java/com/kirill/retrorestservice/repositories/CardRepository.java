package com.kirill.retrorestservice.repositories;

import com.kirill.retrorestservice.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {
}
