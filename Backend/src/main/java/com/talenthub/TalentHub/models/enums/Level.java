package com.talenthub.TalentHub.models.enums;

public enum Level {
    INICIANTE("Iniciante"),
    INTERMEDIARIO("Intermediário"),
    AVANCADO("Avançado"),
    EXPERT("Expert");

    private String level;

    Level(String level) {
        this.level = level;
    }

    public String getLevel() {
        return this.level;
    }
}
