package com.talenthub.TalentHub.models.enums;

public enum StatusInterest {
    INTERESSE("Interesse"),
    RESERVADO("Reservado"),
    CONTRATADO("Contratado"),
    REJEITADO("Rejeitado");

    private String statusInterest;

    StatusInterest(String statusInterest) {
        this.statusInterest = statusInterest;
    }

    public String getStatusInterest() {
        return this.statusInterest;
    }
}
