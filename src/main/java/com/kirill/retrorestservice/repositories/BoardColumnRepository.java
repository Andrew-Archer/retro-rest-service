package com.kirill.retrorestservice.repositories;

import com.kirill.retrorestservice.model.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BoardColumnRepository extends JpaRepository<BoardColumn, UUID> {
}
