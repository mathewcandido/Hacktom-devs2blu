package com.talenthub.TalentHub.models;

import com.talenthub.TalentHub.models.enums.Status;
import com.talenthub.TalentHub.models.enums.StatusInterest;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "leader_interests")
public class LeaderInterests {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private Leader leader;
    private Participant participant;
    private StatusInterest status = StatusInterest.INTERESSE;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}
