package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.dtos.CommentDto;
import com.kirill.retrorestservice.model.entities.Comment;
import com.kirill.retrorestservice.services.CardService;
import com.kirill.retrorestservice.services.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentService commentService;
    private final CardService cardService;

    public CommentController(CommentService commentService,
                             CardService cardService) {
        this.commentService = commentService;
        this.cardService = cardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentDto> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(CommentDto.toDto(commentService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<CommentDto>> findAll() {
        return ResponseEntity.ok(CommentDto.toDtos(commentService.findAll()));
    }

    @PostMapping
    public ResponseEntity<CommentDto> create(@RequestBody CommentDto cardDto) {
        return new ResponseEntity<>(CommentDto.toDto(commentService.create(toEntity(cardDto))), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<CommentDto> update(@RequestBody CommentDto cardDto) {
        return ResponseEntity.ok(CommentDto.toDto(commentService.update(toEntity(cardDto))));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        commentService.delete(id);
    }

    private Comment toEntity(CommentDto commentDto) {
        var comment = new Comment();
        comment.setId(commentDto.getId());
        comment.setContent(commentDto.getContent());
        comment.setCard(cardService.findById(commentDto.getCard()));
        return comment;
    }
}
