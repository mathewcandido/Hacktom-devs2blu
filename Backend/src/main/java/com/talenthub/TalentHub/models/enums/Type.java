package com.talenthub.TalentHub.models.enums;

public enum Type {
    AVALIACAO("Avaliação"),
    REUNIAO("Reunião"),
    PROJETO("Projeto"),
    FEEDBACK("Feedback"),
    MILESTONE("Milestone");

    private String type;

    Type(String type) {
        this.type = type;
    }

    public String getType() {
        return this.type;
    }
}
