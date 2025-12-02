package com.talenthub.TalentHub.controllers;

import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.services.LeaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leaders")
public class LeaderController {
    private final LeaderService leaderService;

    public LeaderController(LeaderService leaderService) {
        this.leaderService = leaderService;
    }

    @GetMapping
    public ResponseEntity<List<Leader>> getAll(){
        return ResponseEntity.ok(leaderService.getAll());
    }

    @PostMapping
    public ResponseEntity<Leader> create(@RequestBody Leader leader){
        return ResponseEntity.ok(leaderService.create(leader));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id){
        try {
            leaderService.delete(id);
            return ResponseEntity.noContent().build();
        }
        catch (Exception e){
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Leader> update(@PathVariable UUID id, @RequestBody Leader leader){
        return ResponseEntity.ok(leaderService.update(id, leader));
    }
}
