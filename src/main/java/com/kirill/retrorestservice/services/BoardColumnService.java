package com.kirill.retrorestservice.services;

import com.kirill.retrorestservice.model.entities.BoardColumn;
import com.kirill.retrorestservice.model.dtos.BoardColumnDto;
import com.kirill.retrorestservice.repositories.BoardColumnRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    @Transactional(readOnly = true)
    public List<BoardColumn> findAllByIds(List<BoardColumnDto> columnDtos) {
        return boardColumnRepository.findAllById(columnDtos
                .stream()
                .map(BoardColumnDto::getId)
                .collect(Collectors.toList()));
    }
}
