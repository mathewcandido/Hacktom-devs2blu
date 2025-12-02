package com.talenthub.TalentHub.models.enums;


public enum Category {
    Tecnica("Técnica"),
    Comportamental("Comportamental"),
    Lideranca("Liderança"),
    Comunicacao("Comunicação");

    private String category;

    Category(String category) {
        this.category = category;
    }

    public String getCategory() {
        return this.category;
    }
}
