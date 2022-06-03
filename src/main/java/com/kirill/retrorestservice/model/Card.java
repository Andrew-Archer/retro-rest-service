package com.kirill.retrorestservice.model;

import javax.persistence.*;
import java.util.UUID;


@Table(name = "CARD", indexes = {
        @Index(name = "IDX_CARD_BOARD_COLUMN_ID", columnList = "BOARD_COLUMN_ID")
})
@Entity
public class Card {
    @GeneratedValue
    @Column(name = "ID", nullable = false)
    @Id
    private UUID id;

    @Column(name = "TITLE")
    @Lob
    private String title;

    @JoinColumn(name = "BOARD_COLUMN_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private BoardColumn boardColumn;

    public BoardColumn getBoardColumn() {
        return boardColumn;
    }

    public void setBoardColumn(BoardColumn boardColumn) {
        this.boardColumn = boardColumn;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}