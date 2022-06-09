package com.kirill.retrorestservice.repositories;

import com.kirill.retrorestservice.model.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
}
