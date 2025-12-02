package com.talenthub.TalentHub.controllers;

import com.talenthub.TalentHub.models.Participant;
import com.talenthub.TalentHub.repositories.ParticipantRepository;
import com.talenthub.TalentHub.services.ParticipantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {
    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping
    public ResponseEntity<Page<Participant>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Participant> participants = participantService.getAll(pageable);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Participant>> getById(@PathVariable UUID id){
        return ResponseEntity.ok(participantService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Participant> create(@RequestBody Participant participant){
        return ResponseEntity.ok(participantService.create(participant));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id){
        try {
            participantService.delete(id);
            return ResponseEntity.noContent().build();
        }
        catch (Exception e){
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Participant> update(@PathVariable UUID id, Participant participant) {
        return ResponseEntity.ok(participantService.update(id, participant));
    }
}
