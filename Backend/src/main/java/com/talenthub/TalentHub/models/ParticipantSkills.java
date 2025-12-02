package com.talenthub.TalentHub.models;

import com.talenthub.TalentHub.models.enums.Level;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity(name = "participant_skills")
public class ParticipantSkills {
    private Participant participant;
    private String skillName;
    private Level level = Level.INTERMEDIARIO;
}
