package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.entities.Card;
import com.kirill.retrorestservice.model.dtos.CardDto;
import com.kirill.retrorestservice.services.BoardColumnService;
import com.kirill.retrorestservice.services.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/card")
public class CardController {
    private final CardService cardService;
    private final BoardColumnService boardColumnService;

    public CardController(CardService cardService,
                          BoardColumnService boardColumnService) {
        this.cardService = cardService;
        this.boardColumnService = boardColumnService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDto> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(CardDto.toDto(cardService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<CardDto>> findAll() {
        return ResponseEntity.ok(CardDto.toDtos(cardService.findAll()));
    }

    @PostMapping
    public ResponseEntity<CardDto> create(@RequestBody CardDto cardDto) {
        return new ResponseEntity<>(CardDto.toDto(cardService.create(toEntity(cardDto))), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<CardDto> update(@RequestBody CardDto cardDto) {
        return ResponseEntity.ok(CardDto.toDto(cardService.update(toEntity(cardDto))));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        cardService.delete(id);
    }

    private Card toEntity(CardDto cardDto){
        var card = new Card();
        card.setId(cardDto.getId());
        card.setBoardColumn(boardColumnService.findById(cardDto.getBoardColumn()));
        card.setTitle(cardDto.getTitle());
        return card;
    }
}
