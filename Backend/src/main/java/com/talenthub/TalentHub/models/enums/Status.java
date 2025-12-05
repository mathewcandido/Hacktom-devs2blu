package com.talenthub.TalentHub.models.enums;

public enum Status {
    EM_FORMACAO("Em Formação"),
    DISPONIVEL("Disponível"),
    RESERVADO("Reservado"),
    CONTRATADO("Contratado");

    private String displayName;

    Status(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return this.displayName;
    }
}
