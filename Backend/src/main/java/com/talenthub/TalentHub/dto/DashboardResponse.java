package com.talenthub.TalentHub.dto;

public class DashboardResponse {
    private Integer totalParticipants;
    private Integer availableParticipants;
    private Integer reservedPaticipants;
    private Integer hiredParticipants;
    private Double averageEvolution;
    private Integer activeLeaders;

    public DashboardResponse(Integer totalParticipants, Integer availableParticipants, Integer reservedPaticipants, Integer hiredParticipants, Double averageEvolution, Integer activeLeaders) {
        this.totalParticipants = totalParticipants;
        this.availableParticipants = availableParticipants;
        this.reservedPaticipants = reservedPaticipants;
        this.hiredParticipants = hiredParticipants;
        this.averageEvolution = averageEvolution;
        this.activeLeaders = activeLeaders;
    }

    public DashboardResponse() {
    }

    public Integer getTotalParticipants() {
        return totalParticipants;
    }

    public void setTotalParticipants(Integer totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public Integer getAvailableParticipants() {
        return availableParticipants;
    }

    public void setAvailableParticipants(Integer availableParticipants) {
        this.availableParticipants = availableParticipants;
    }

    public Integer getReservedPaticipants() {
        return reservedPaticipants;
    }

    public void setReservedPaticipants(Integer reservedPaticipants) {
        this.reservedPaticipants = reservedPaticipants;
    }

    public Integer getHiredParticipants() {
        return hiredParticipants;
    }

    public void setHiredParticipants(Integer hiredParticipants) {
        this.hiredParticipants = hiredParticipants;
    }

    public Double getAverageEvolution() {
        return averageEvolution;
    }

    public void setAverageEvolution(Double averageEvolution) {
        this.averageEvolution = averageEvolution;
    }

    public Integer getActiveLeaders() {
        return activeLeaders;
    }

    public void setActiveLeaders(Integer activeLeaders) {
        this.activeLeaders = activeLeaders;
    }
}
