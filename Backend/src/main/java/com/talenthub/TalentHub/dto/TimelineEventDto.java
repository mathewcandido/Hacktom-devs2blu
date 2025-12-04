package com.talenthub.TalentHub.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TimelineEventDto {
    private UUID id;
    private String type;
    private String title;
    private String description;
    private LocalDateTime date;

    public TimelineEventDto() {}

    public TimelineEventDto(UUID id, String type, String title, String description, LocalDateTime date) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.date = date;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}