package com.talenthub.TalentHub.models;

import com.talenthub.TalentHub.models.enums.Category;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity(name = "evaluations")
public class Evaluations {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id")
    private Leader evaluator;
    private String evaluatorName;
    private Integer score;
    private String feedback;
    @Enumerated(EnumType.STRING)
    private Category category;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Evaluations(String id, Participant participant, Leader evaluator, String evaluatorName, Integer score, String feedback, Category category, LocalDateTime createdAt) {
        this.id = id;
        this.participant = participant;
        this.evaluator = evaluator;
        this.evaluatorName = evaluatorName;
        this.score = score;
        this.feedback = feedback;
        this.category = category;
        this.createdAt = createdAt;
    }

    public Evaluations() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public Leader getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(Leader evaluator) {
        this.evaluator = evaluator;
    }

    public String getEvaluatorName() {
        return evaluatorName;
    }

    public void setEvaluatorName(String evaluatorName) {
        this.evaluatorName = evaluatorName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
