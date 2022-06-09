package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.entities.BoardColumn;
import com.kirill.retrorestservice.model.dtos.BoardColumnDto;
import com.kirill.retrorestservice.model.dtos.CardDto;
import com.kirill.retrorestservice.services.BoardColumnService;
import com.kirill.retrorestservice.services.BoardService;
import com.kirill.retrorestservice.services.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/boardColumn")
public class BoardColumnController {
    private final BoardColumnService boardColumnService;
    private final BoardService boardService;

    public BoardColumnController(BoardColumnService boardColumnService,
                                 BoardService boardService) {
        this.boardColumnService = boardColumnService;
        this.boardService = boardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardColumnDto> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(BoardColumnDto.toDto(boardColumnService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<BoardColumnDto>> findAll() {
        return ResponseEntity.ok(BoardColumnDto.toDtos(boardColumnService.findAll()));
    }

    @PostMapping
    public ResponseEntity<BoardColumnDto> create(@RequestBody BoardColumnDto boardColumnDto) {
        return new ResponseEntity<>(BoardColumnDto.toDto(boardColumnService.create(toEntity(boardColumnDto))), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<BoardColumnDto> update(@RequestBody BoardColumnDto boardColumnDto) {
        return ResponseEntity.ok(BoardColumnDto.toDto(boardColumnService.update(toEntity(boardColumnDto))));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        boardColumnService.delete(id);
    }

    private BoardColumn toEntity(BoardColumnDto boardColumnDto){
        var boardColumn = new BoardColumn();
        boardColumn.setId(boardColumnDto.getId());
        boardColumn.setBoard(boardService.findById(boardColumnDto.getBoard()));
        boardColumn.setName(boardColumnDto.getName());
        return boardColumn;
    }
}
