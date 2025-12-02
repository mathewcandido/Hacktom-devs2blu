package com.talenthub.TalentHub.services;

import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.models.Participant;
import com.talenthub.TalentHub.repositories.ParticipantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

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
        return participantRepository.save(participant);
    }

    public void delete(UUID id){
        Optional<Participant> oldParticipant = participantRepository.findById(id);
        if (oldParticipant.isEmpty() || oldParticipant == null)
            return;
        participantRepository.deleteById(id);
    }

    public Participant update(UUID id, Participant participant){
        Optional<Participant> oldParticipant = participantRepository.findById(id);
        if (oldParticipant.isEmpty() || oldParticipant == null)
            return new Participant();
        Participant newParticipant = participant;
        newParticipant.setId(id);
        return participantRepository.save(newParticipant);
    }
}
