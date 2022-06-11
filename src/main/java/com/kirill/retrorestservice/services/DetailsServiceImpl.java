package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.configurations.security.UserDetailsImpl;
import com.kirill.retrorestservice.model.entities.User;
import com.kirill.retrorestservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class DetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.getByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException("Could not find user with this email.");
        } else {
            return new UserDetailsImpl(user);
        }
    }
}
