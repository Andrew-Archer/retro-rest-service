package com.kirill.retrorestservice.model.dtos;

import com.kirill.retrorestservice.model.entities.Board;
import lombok.Builder;
import lombok.Data;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Data
@Builder
public class BoardDto {
    private UUID id;
    private Date endsOn;
    private Date creationDate;
    private String name;
    private Integer maxLikesPerUser;
    private List<BoardColumnDto> columns;
    private UUID owner;

    public static BoardDto toDto(Board board) {
        if (board == null) return null;
        return BoardDto.builder()
                .id(board.getId())
                .owner(board.getOwner().getId())
                .endsOn(board.getEndsOn())
                .maxLikesPerUser(board.getMaxLikesPerUser())
                .creationDate(board.getCreationDate())
                .name(board.getName())
                .columns(BoardColumnDto.toDtos(board.getColumns()))
                .build();
    }

    public static List<BoardDto> toDtos(Collection<Board> boards) {
        if (boards != null) {
            return boards.stream().map(BoardDto::toDto).collect(toList());
        } else {
            return Collections.emptyList();
        }
    }
}
