package com.kirill.retrorestservice.model.entities;

import javax.persistence.*;
import java.util.UUID;

@Table(name = "COMMENT_", indexes = {
        @Index(name = "IDX_COMMENT_CARD_ID", columnList = "CARD_ID")
})
@Entity
public class Comment {
    @Id
    @Column(name = "ID", nullable = false)
    @GeneratedValue
    private UUID id;

    @Column(name="CONTENT_")
    private String content;

    @JoinColumn(name = "CARD_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Card card;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }
}
