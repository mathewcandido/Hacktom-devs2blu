package com.talenthub.TalentHub.repositories;

import com.talenthub.TalentHub.models.Participant;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.UUID;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
    Page<Participant> getAllParticipants(Pageable pageable);
}
