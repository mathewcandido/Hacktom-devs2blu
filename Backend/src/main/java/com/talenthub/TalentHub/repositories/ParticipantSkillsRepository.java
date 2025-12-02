package com.talenthub.TalentHub.repositories;

import com.talenthub.TalentHub.models.ParticipantSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ParticipantSkillsRepository extends JpaRepository<ParticipantSkills, UUID> {
}
