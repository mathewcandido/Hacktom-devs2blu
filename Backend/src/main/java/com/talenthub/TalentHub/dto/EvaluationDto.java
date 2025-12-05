package com.talenthub.TalentHub.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class EvaluationDto {
    private UUID id;
    private String category;
    private Integer score;
    private String feedback;
    private LocalDateTime createdAt;
    private String evaluatorName;

    public EvaluationDto() {}

    public EvaluationDto(UUID id, String category, Integer score, String feedback, 
                        LocalDateTime createdAt, String evaluatorName) {
        this.id = id;
        this.category = category;
        this.score = score;
        this.feedback = feedback;
        this.createdAt = createdAt;
        this.evaluatorName = evaluatorName;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }
}