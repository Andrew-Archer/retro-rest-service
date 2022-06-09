package com.kirill.retrorestservice.model.dtos;

import com.kirill.retrorestservice.model.entities.BoardColumn;
import lombok.Builder;
import lombok.Data;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Data
@Builder
public class BoardColumnDto {
    private UUID id;
    private String name;
    private List<CardDto> cards;
    private UUID board;

    public static BoardColumnDto toDto(BoardColumn boardColumn) {
        if (boardColumn == null) return null;
        return BoardColumnDto.builder()
                .id(boardColumn.getId())
                .name(boardColumn.getName())
                .cards(CardDto.toDtos(boardColumn.getCards()))
                .board(boardColumn.getBoard().getId())
                .build();
    }

    public static List<BoardColumnDto> toDtos(Collection<BoardColumn> boardColumns) {
        if (boardColumns != null) {
            return boardColumns.stream().map(BoardColumnDto::toDto).collect(toList());
        } else {
            return Collections.emptyList();
        }
    }
}
