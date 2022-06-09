package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.entities.Card;
import com.kirill.retrorestservice.repositories.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CardService {
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @Transactional(readOnly = true)
    public Card findById(UUID id) {
        return cardRepository.findById(id).get();
    }

    @Transactional(readOnly = true)
    public List<Card> findAll() {
        return cardRepository.findAll();
    }
    @Transactional(readOnly = true)
    public List<Card> findAllByIds(Iterable<UUID> ids){
        return cardRepository.findAllById(ids);
    }

    @Transactional
    public Card create(Card card) {
        return cardRepository.save(card);
    }

    @Transactional
    public Card update(Card card) {
        return cardRepository.save(card);
    }

    @Transactional
    public void delete(UUID id) {
        cardRepository.delete(findById(id));
    }
}
