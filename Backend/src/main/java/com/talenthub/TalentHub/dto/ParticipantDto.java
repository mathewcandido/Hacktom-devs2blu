package com.talenthub.TalentHub.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ParticipantDto {
    private UUID id;
    private String name;
    private String email;
    private String area;
    private String status;
    private Integer evolution;
    private String batch;
    private LocalDateTime startDate;
    private String photo;
    private String phone;
    private String bio;
    private List<String> skills;
    private List<EvaluationDto> evaluations;
    private List<TimelineEventDto> timeline;

    public ParticipantDto() {}

    public ParticipantDto(UUID id, String name, String email, String area, String status, 
                         Integer evolution, String batch, LocalDateTime startDate, 
                         String photo, String phone, String bio, List<String> skills,
                         List<EvaluationDto> evaluations, List<TimelineEventDto> timeline) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.area = area;
        this.status = status;
        this.evolution = evolution;
        this.batch = batch;
        this.startDate = startDate;
        this.photo = photo;
        this.phone = phone;
        this.bio = bio;
        this.skills = skills;
        this.evaluations = evaluations;
        this.timeline = timeline;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getEvolution() { return evolution; }
    public void setEvolution(Integer evolution) { this.evolution = evolution; }
    
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    
    public List<EvaluationDto> getEvaluations() { return evaluations; }
    public void setEvaluations(List<EvaluationDto> evaluations) { this.evaluations = evaluations; }
    
    public List<TimelineEventDto> getTimeline() { return timeline; }
    public void setTimeline(List<TimelineEventDto> timeline) { this.timeline = timeline; }
}