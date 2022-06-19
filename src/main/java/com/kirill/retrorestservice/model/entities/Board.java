package com.kirill.retrorestservice.model.entities;

import javax.persistence.*;
import java.util.Date;
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

    @Column(name = "NAME_", nullable = false)
    private String name;

    @Column(name = "MAX_LIKES_PER_USER")
    private Integer maxLikesPerUser;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE)
    private List<BoardColumn> columns;

    @JoinColumn(name = "OWNER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User owner;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATION_DATE", nullable = false)
    private Date creationDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "ENDS_ON")
    private Date endsOn;

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

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

    public Date getEndsOn() {
        return endsOn;
    }

    public void setEndsOn(Date endsOn) {
        this.endsOn = endsOn;
    }

    public Integer getMaxLikesPerUser() {
        return maxLikesPerUser;
    }

    public void setMaxLikesPerUser(Integer maxLikesPerUser) {
        this.maxLikesPerUser = maxLikesPerUser;
    }
}