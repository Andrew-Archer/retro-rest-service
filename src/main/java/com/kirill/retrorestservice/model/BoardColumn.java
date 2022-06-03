package com.kirill.retrorestservice.model;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Table(name = "BOARD_COLUMN", indexes = {
        @Index(name = "IDX_BOARDCOLUMN_BOARD_ID", columnList = "BOARD_ID")
})
@Entity
public class BoardColumn {
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @OneToMany(mappedBy = "boardColumn")
    private List<Card> cards;

    @Column(name = "DELETED_BY")
    private String deletedBy;

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

    public String getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}