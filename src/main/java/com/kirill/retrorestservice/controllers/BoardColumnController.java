package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.BoardColumn;
import com.kirill.retrorestservice.services.BoardColumnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boardColumn")
public class BoardColumnController {
    private final BoardColumnService boardColumnService;

    public BoardColumnController(BoardColumnService boardColumnService) {
        this.boardColumnService = boardColumnService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardColumn> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(boardColumnService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<BoardColumn>> findAll() {
        return ResponseEntity.ok(boardColumnService.findAll());
    }

    @PostMapping
    public ResponseEntity<BoardColumn> create(@RequestBody BoardColumn boardColumn) {
        return new ResponseEntity<>(boardColumnService.create(boardColumn), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<BoardColumn> update(@RequestBody BoardColumn boardColumn) {
        return ResponseEntity.ok(boardColumnService.update(boardColumn));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        boardColumnService.delete(id);
    }
}
