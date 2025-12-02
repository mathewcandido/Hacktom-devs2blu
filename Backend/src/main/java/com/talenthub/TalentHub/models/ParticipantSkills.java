package com.talenthub.TalentHub.models;

import com.talenthub.TalentHub.models.enums.Level;
import jakarta.persistence.*;

import java.util.UUID;

@Entity(name = "participant_skills")
public class ParticipantSkills {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;
    private String skillName;
    @Enumerated(EnumType.STRING)
    private Level level = Level.INTERMEDIARIO;
}
