package com.kirill.retrorestservice.model;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Table(name = "BOARD", indexes = {
        @Index(name = "IDX_BOARD_OWNER_ID", columnList = "OWNER_ID")
})
@Entity
public class Board {
    @GeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @Column(name = "NAME", nullable = false)
    private String name;


    @OneToMany(mappedBy = "board")
    private List<BoardColumn> columns;

    @JoinColumn(name = "OWNER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User owner;

    public List<BoardColumn> getColumns() {
        return columns;
    }

    public void setColumns(List<BoardColumn> columns) {
        this.columns = columns;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}