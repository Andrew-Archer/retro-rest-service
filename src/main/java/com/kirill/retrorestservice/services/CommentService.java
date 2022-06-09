package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.entities.Comment;
import com.kirill.retrorestservice.repositories.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Transactional(readOnly = true)
    public Comment findById(UUID id) {
        return commentRepository.findById(id).get();
    }

    @Transactional(readOnly = true)
    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Comment> findAllByIds(Iterable<UUID> ids) {
        return commentRepository.findAllById(ids);
    }

    @Transactional
    public Comment create(Comment comment) {
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment update(Comment comment) {
        return commentRepository.save(comment);
    }

    @Transactional
    public void delete(UUID id) {
        commentRepository.delete(findById(id));
    }
}
