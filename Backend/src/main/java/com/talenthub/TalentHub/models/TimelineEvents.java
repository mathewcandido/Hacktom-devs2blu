package com.talenthub.TalentHub.models;

import com.talenthub.TalentHub.models.enums.Type;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "timeline_events")
public class TimelineEvents {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private Participant participant;
    private Type type;
    private String title;
    private String description;
    private String actorName;
    private LocalDateTime createdAt = LocalDateTime.now();

    public TimelineEvents(UUID id, Participant participant, Type type, String title, String description, String actorName, LocalDateTime createdAt) {
        this.id = id;
        this.participant = participant;
        this.type = type;
        this.title = title;
        this.description = description;
        this.actorName = actorName;
        this.createdAt = createdAt;
    }

    public TimelineEvents() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
