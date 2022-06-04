package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.Board;
import com.kirill.retrorestservice.repositories.BoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BoardService {
    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    @Transactional(readOnly = true)
    public Board findById(UUID id) {
        return boardRepository.findById(id).get();
    }

    @Transactional(readOnly = true)
    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    @Transactional
    public Board create(Board board) {
        return boardRepository.save(board);
    }

    @Transactional
    public Board update(Board board) {
        return boardRepository.save(board);
    }

    @Transactional
    public void delete(UUID id) {
        boardRepository.delete(findById(id));
    }
}
