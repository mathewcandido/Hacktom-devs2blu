package com.talenthub.TalentHub.services;

import com.talenthub.TalentHub.dto.ParticipantDto;
import com.talenthub.TalentHub.models.Participant;
import com.talenthub.TalentHub.repositories.ParticipantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ParticipantService {
    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public Page<Participant> getAll(Pageable pageable){
        return participantRepository.findAll(pageable);
    }

    public Optional<Participant> getById(UUID id){
        return participantRepository.findById(id);
    }

    public Participant create(Participant participant){
        participant.setCreatedAt(LocalDateTime.now());
        participant.setStartDate(LocalDateTime.now());
        return participantRepository.save(participant);
    }

    public void delete(UUID id){
        Optional<Participant> oldParticipant = participantRepository.findById(id);
        if (oldParticipant.isEmpty() || oldParticipant == null)
            return;
        participantRepository.deleteById(id);
    }

    public Participant update(String id, Participant participant){
        Optional<Participant> oldParticipant = participantRepository.findById(UUID.fromString(id));
        if (oldParticipant.isEmpty() || oldParticipant == null)
            return new Participant();
        Participant newParticipant = participant;
        newParticipant.setId(id);
        newParticipant.setUpdatedAt(LocalDateTime.now());
        return participantRepository.save(newParticipant);
    }

    public List<ParticipantDto> getAllParticipants() {
        List<Participant> participants = participantRepository.findAll();
        return participants.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public ParticipantDto getParticipantById(UUID id) {
        Optional<Participant> participant = participantRepository.findById(id);
        if (participant.isPresent()) {
            return convertToDto(participant.get());
        }
        throw new RuntimeException("Participant not found with id: " + id);
    }

    private ParticipantDto convertToDto(Participant participant) {
        String statusText = convertStatusToText(participant.getStatus().toString());
        
        return new ParticipantDto(
            participant.getId(),
            participant.getName(),
            participant.getEmail(),
            participant.getArea(),
            statusText,
            participant.getEvolution() != null ? participant.getEvolution() : 0,
            participant.getBatch(),
            participant.getStartDate(),
            participant.getPhotoUrl(),
            participant.getPhone(),
            participant.getBio(),
            new ArrayList<>(), // skills - implementar quando necessário
            new ArrayList<>(), // evaluations - implementar quando necessário
            new ArrayList<>()  // timeline - implementar quando necessário
        );
    }

    private String convertStatusToText(String status) {
        switch (status) {
            case "EM_FORMACAO": return "Em Formação";
            case "DISPONIVEL": return "Disponível";
            case "RESERVADO": return "Reservado";
            case "CONTRATADO": return "Contratado";
            default: return "Em Formação";
        }
    }
}
