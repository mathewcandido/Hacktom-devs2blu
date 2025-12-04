package com.talenthub.TalentHub.models;

import com.talenthub.TalentHub.models.enums.StatusInterest;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity(name = "leader_interests")
public class LeaderInterests {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leader_id", nullable = false)
    private Leader leader;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;
    @Enumerated(EnumType.STRING)
    private StatusInterest status = StatusInterest.INTERESSE;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}
