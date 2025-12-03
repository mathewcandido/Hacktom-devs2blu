package com.talenthub.TalentHub.repositories;

import com.talenthub.TalentHub.models.Participant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
    @Query("SELECT COUNT(p) FROM participants p WHERE p.status = ?1")
    Integer getCountParticipantsByStatus(Integer status);

}
