package com.kirill.retrorestservice.model.entities;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "USER_", indexes = {
        @Index(name = "IDX_USER__ON_EMAIL", columnList = "EMAIL", unique = true)
})
public class User {

    @Id
    @Column(name = "ID", nullable = false)
    @GeneratedValue
    private UUID id;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE)
    private List<Board> boards;

    @Column(name = "PASSWORD_")
    protected String password;

    @Column(name = "EMAIL", nullable = false)
    protected String email;

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}