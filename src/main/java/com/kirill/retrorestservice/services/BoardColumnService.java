package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.BoardColumn;
import com.kirill.retrorestservice.repositories.BoardColumnRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BoardColumnService {
    private final BoardColumnRepository boardColumnRepository;

    public BoardColumnService(BoardColumnRepository boardColumnRepository) {
        this.boardColumnRepository = boardColumnRepository;
    }

    @Transactional(readOnly = true)
    public BoardColumn findById(UUID id) {
        return boardColumnRepository.findById(id).get();
    }

    @Transactional(readOnly = true)
    public List<BoardColumn> findAll() {
        return boardColumnRepository.findAll();
    }

    @Transactional
    public BoardColumn create(BoardColumn boardColumn) {
        return boardColumnRepository.save(boardColumn);
    }

    @Transactional
    public BoardColumn update(BoardColumn boardColumn) {
        return boardColumnRepository.save(boardColumn);
    }

    @Transactional
    public void delete(UUID id) {
        boardColumnRepository.delete(findById(id));
    }
}
