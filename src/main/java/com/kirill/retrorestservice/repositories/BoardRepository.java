package com.kirill.retrorestservice.repositories;

import com.kirill.retrorestservice.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {
}
