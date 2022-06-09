package com.kirill.retrorestservice.model.dtos;

import com.kirill.retrorestservice.model.entities.Card;
import lombok.Builder;
import lombok.Data;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class CardDto {
    private UUID id;
    private String title;
    private UUID boardColumn;

    public static CardDto toDto(Card card) {
        return CardDto.builder()
                .id(card.getId())
                .boardColumn(card.getBoardColumn().getId())
                .title(card.getTitle())
                .build();
    }

    public static List<CardDto> toDtos(Collection<Card> cards) {
        if (cards != null) {
            return cards.stream().map(CardDto::toDto).collect(Collectors.toList());
        } else {
            return Collections.emptyList();
        }
    }
}
