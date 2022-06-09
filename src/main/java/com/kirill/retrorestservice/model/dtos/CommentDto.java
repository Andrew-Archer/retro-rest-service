package com.kirill.retrorestservice.model.dtos;

import com.kirill.retrorestservice.model.entities.Comment;
import lombok.Builder;
import lombok.Data;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Data
@Builder
public class CommentDto {

    private UUID id;
    private String content;
    private UUID card;

    public static CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .card(comment.getCard().getId())
                .build();
    }

    public static List<CommentDto> toDtos(Collection<Comment> comments) {
        if (comments != null) {
            return comments.stream().map(CommentDto::toDto).collect(toList());
        } else {
            return Collections.emptyList();
        }
    }

}
