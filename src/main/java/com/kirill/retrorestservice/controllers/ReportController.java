package com.kirill.retrorestservice.controllers;

import com.kirill.retrorestservice.model.entities.Card;
import com.kirill.retrorestservice.model.entities.User;
import com.kirill.retrorestservice.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    private UserService userService;

    @GetMapping(value = "/getFile/{userId}", produces = MediaType.MULTIPART_MIXED_VALUE)
    public @ResponseBody byte[] getFile(@PathVariable UUID userId, HttpServletResponse response) {
        User user = userService.findById(userId);
        response.setHeader("Content-Disposition", "attachment; filename=" + "Wow.csv");
        return buildCsvContent(getTopTenCards(user), user).getBytes(StandardCharsets.UTF_8);
    }

    private String getReportTitle(User user) {
        return String.format("Report for %s top 10 cards from %s",
                user.getEmail(),
                LocalDateTime.now());
    }

    private List<Card> getTopTenCards(User user) {
        List<Card> cards = Collections.emptyList();
        if (user != null) {
            cards = user.getBoards().stream()
                    .flatMap(board -> board
                            .getColumns().stream().
                            flatMap(boardColumn -> boardColumn
                                    .getCards().stream()))
                    .sorted((card1, card2) -> Long.compare(card2.getLikes(), card1.getLikes()))
                    .collect(Collectors.toList());
        }
        return cards;
    }

    private String buildCsvContent(Collection<Card> cards, User user) {
        StringBuilder sb = new StringBuilder(getReportTitle(user));
        sb.append("\n");
        sb.append("Title, Likes\n");
        cards.forEach(card -> sb
                .append(card.getTitle())
                .append(", ")
                .append(card.getLikes())
                .append("\n"));
        return sb.toString();
    }
}
