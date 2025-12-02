package com.talenthub.TalentHub.models.enums;

public enum Status {
    EM_FORMACAO("Em Formação"),
    DISPONIVEL("Disponível"),
    RESERVADO("Reservado"),
    CONTRATADO("Contratado");

    private String status;

    Status(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }
}
