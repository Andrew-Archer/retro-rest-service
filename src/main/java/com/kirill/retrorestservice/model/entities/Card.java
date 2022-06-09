package com.kirill.retrorestservice.model.entities;

import javax.persistence.*;
import java.util.List;
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

    @Column(name = "LIKES")
    private Long likes;

    @JoinColumn(name = "BOARD_COLUMN_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private BoardColumn boardColumn;

    @OneToMany(mappedBy = "card", cascade = CascadeType.REMOVE)
    private List<Comment> comments;

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

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public Long getLikes() {
        return likes;
    }

    public void setLikes(Long likes) {
        this.likes = likes;
    }
}