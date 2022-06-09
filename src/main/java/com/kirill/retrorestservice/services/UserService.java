package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.entities.User;
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
        /*var existingUserId = user.getId();
        if (existingUserId != null) {
            var userToUpdate = findById(existingUserId);
            BeanUtils.copyProperties(user, userToUpdate);*/
            return userRepository.save(user);
       /* }else{
            return null;
        }*/
    }

    @Transactional
    public User create(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteById(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    @Transactional(readOnly = true)
    public User findById(UUID id) {
        return userRepository.findById(id).get();
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email){
        return userRepository.getByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
