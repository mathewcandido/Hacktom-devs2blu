package com.talenthub.TalentHub.dto;

public class DashboardStatsDto {
    private Integer totalParticipants;
    private Integer availableParticipants;
    private Integer reservedParticipants;
    private Integer hiredParticipants;
    private Double averageEvolution;

    public DashboardStatsDto() {}

    public DashboardStatsDto(Integer totalParticipants, Integer availableParticipants, 
                            Integer reservedParticipants, Integer hiredParticipants, 
                            Double averageEvolution) {
        this.totalParticipants = totalParticipants;
        this.availableParticipants = availableParticipants;
        this.reservedParticipants = reservedParticipants;
        this.hiredParticipants = hiredParticipants;
        this.averageEvolution = averageEvolution;
    }

    // Getters and Setters
    public Integer getTotalParticipants() { return totalParticipants; }
    public void setTotalParticipants(Integer totalParticipants) { this.totalParticipants = totalParticipants; }
    
    public Integer getAvailableParticipants() { return availableParticipants; }
    public void setAvailableParticipants(Integer availableParticipants) { this.availableParticipants = availableParticipants; }
    
    public Integer getReservedParticipants() { return reservedParticipants; }
    public void setReservedParticipants(Integer reservedParticipants) { this.reservedParticipants = reservedParticipants; }
    
    public Integer getHiredParticipants() { return hiredParticipants; }
    public void setHiredParticipants(Integer hiredParticipants) { this.hiredParticipants = hiredParticipants; }
    
    public Double getAverageEvolution() { return averageEvolution; }
    public void setAverageEvolution(Double averageEvolution) { this.averageEvolution = averageEvolution; }
}