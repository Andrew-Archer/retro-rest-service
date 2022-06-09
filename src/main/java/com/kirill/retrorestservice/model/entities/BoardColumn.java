package com.kirill.retrorestservice.model.entities;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Table(name = "BOARD_COLUMN", indexes = {
        @Index(name = "IDX_BOARDCOLUMN_BOARD_ID", columnList = "BOARD_ID")
})
@Entity
public class BoardColumn {
    @GeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @Column(name = "NAME_", nullable = false)
    private String name;

    @OneToMany(mappedBy = "boardColumn", cascade = CascadeType.REMOVE)
    private List<Card> cards;

    @JoinColumn(name = "BOARD_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Board board;

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
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