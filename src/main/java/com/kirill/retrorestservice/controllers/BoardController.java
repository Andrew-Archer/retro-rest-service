package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.Board;
import com.kirill.retrorestservice.services.BoardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/board/")
public class BoardController {
    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(boardService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Board>> findAll() {
        return ResponseEntity.ok(boardService.findAll());
    }

    @PostMapping
    public ResponseEntity<Board> create(@RequestBody Board board) {
        return new ResponseEntity<>(boardService.create(board), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Board> update(@RequestBody Board board) {
        return ResponseEntity.ok(boardService.update(board));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        boardService.delete(id);
    }
}
