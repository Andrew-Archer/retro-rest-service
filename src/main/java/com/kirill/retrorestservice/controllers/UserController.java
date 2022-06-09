package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.entities.User;
import com.kirill.retrorestservice.model.dtos.UserDto;
import com.kirill.retrorestservice.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(UserDto.toDto(userService.findById(id)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> findByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(UserDto.toDto(userService.findByEmail(email)));
    }


    @GetMapping
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(UserDto.toDtos(userService.findAll()));
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(UserDto.toDto(userService.create(toEntity(userDto))), HttpStatus.CREATED);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<UserDto> update(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(UserDto.toDto(userService.update(toEntity(userDto))));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") UUID id) {
        userService.deleteById(id);
    }

    @DeleteMapping("/email/{email}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteByEmail(@PathVariable("email") String email) {
        userService.deleteByEmail(email);
    }

    private User toEntity(UserDto userDto) {
        var user = new User();
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        return user;
    }
}
