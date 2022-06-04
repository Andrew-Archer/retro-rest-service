package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.User;
import com.kirill.retrorestservice.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;


@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User update(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User create(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void delete(UUID id) {
        userRepository.delete(findById(id));
    }

    @Transactional(readOnly = true)
    public User findById(UUID id) {
        return userRepository.findById(id).get();
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
