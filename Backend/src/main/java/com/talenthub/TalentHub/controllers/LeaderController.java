package com.talenthub.TalentHub.controllers;

import com.talenthub.TalentHub.dto.LeaderDto;
import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.services.LeaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class LeaderController {
    private final LeaderService leaderService;

    public LeaderController(LeaderService leaderService) {
        this.leaderService = leaderService;
    }

    @GetMapping("/leaders")
    public ResponseEntity<List<LeaderDto>> getAllLeaders(){
        return ResponseEntity.ok(leaderService.getAllLeaders());
    }

    // Métodos CRUD removidos para evitar conflitos de mapping
    // Foco apenas nos métodos necessários para o frontend
}
