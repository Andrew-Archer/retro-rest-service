package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.entities.Board;
import com.kirill.retrorestservice.model.dtos.BoardDto;
import com.kirill.retrorestservice.services.BoardService;
import com.kirill.retrorestservice.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/board")
public class BoardController {
    private final BoardService boardService;
    private final UserService userService;

    public BoardController(BoardService boardService,
                           UserService userService) {
        this.boardService = boardService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDto> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(BoardDto.toDto(boardService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<BoardDto>> findAll() {
        return ResponseEntity.ok(BoardDto.toDtos(boardService.findAll()));
    }

    @PostMapping
    public ResponseEntity<BoardDto> create(@RequestBody BoardDto boardDto) {
        return new ResponseEntity<>(BoardDto.toDto(boardService.create(toEntity(boardDto))), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<BoardDto> update(@RequestBody BoardDto boardDto) {
        return ResponseEntity.ok(BoardDto.toDto(boardService.update(toEntity(boardDto))));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        boardService.delete(id);
    }

    private Board toEntity(BoardDto boardDto){
        var board = new Board();
        board.setId(boardDto.getId());
        board.setEndsOn(boardDto.getEndsOn());
        board.setCreationDate(boardDto.getCreationDate());
        board.setName(boardDto.getName());
        board.setOwner(userService.findById(boardDto.getOwner()));
        return board;
    }
}
