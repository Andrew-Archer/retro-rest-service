package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.Card;
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

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Card> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(cardService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Card>> findAll() {
        return ResponseEntity.ok(cardService.findAll());
    }

    @PostMapping
    public ResponseEntity<Card> create(@RequestBody Card card) {
        return new ResponseEntity<>(cardService.create(card), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Card> update(@RequestBody Card card) {
        return ResponseEntity.ok(cardService.update(card));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        cardService.delete(id);
    }
}
