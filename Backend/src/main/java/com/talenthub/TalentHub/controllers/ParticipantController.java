package com.talenthub.TalentHub.controllers;

import com.talenthub.TalentHub.dto.ParticipantDto;
import com.talenthub.TalentHub.models.Participant;
import com.talenthub.TalentHub.services.ParticipantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ParticipantController {
    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping("/participants")
    public ResponseEntity<List<ParticipantDto>> getAllParticipants(){
        List<ParticipantDto> participants = participantService.getAllParticipants();
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/participants/{id}")
    public ResponseEntity<ParticipantDto> getParticipantById(@PathVariable UUID id){
        ParticipantDto participant = participantService.getParticipantById(id);
        return ResponseEntity.ok(participant);
    }

    // Métodos CRUD removidos para evitar conflitos de mapping
    // Foco apenas nos métodos necessários para o frontend
}
