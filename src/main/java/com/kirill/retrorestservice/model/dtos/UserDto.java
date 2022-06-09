package com.kirill.retrorestservice.model.dtos;

import com.kirill.retrorestservice.model.entities.User;
import lombok.Builder;
import lombok.Data;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Data
@Builder
public class UserDto {
    private UUID id;
    private List<BoardDto> boards;
    protected String password;
    protected String email;

    public static UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .boards(BoardDto.toDtos(user.getBoards()))
                .build();
    }

    public static List<UserDto> toDtos(Collection<User> users) {
        if (users != null) {
            return users.stream().map(UserDto::toDto).collect(toList());
        } else {
            return Collections.emptyList();
        }
    }
}
