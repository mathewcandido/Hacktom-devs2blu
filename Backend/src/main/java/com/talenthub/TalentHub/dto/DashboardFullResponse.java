package com.talenthub.TalentHub.dto;

import java.util.List;

public class DashboardFullResponse {
    private List<ParticipantDto> participants;
    private List<LeaderDto> leaders;
    private DashboardStatsDto stats;

    public DashboardFullResponse() {}

    public DashboardFullResponse(List<ParticipantDto> participants, List<LeaderDto> leaders, DashboardStatsDto stats) {
        this.participants = participants;
        this.leaders = leaders;
        this.stats = stats;
    }

    // Getters and Setters
    public List<ParticipantDto> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDto> participants) { this.participants = participants; }
    
    public List<LeaderDto> getLeaders() { return leaders; }
    public void setLeaders(List<LeaderDto> leaders) { this.leaders = leaders; }
    
    public DashboardStatsDto getStats() { return stats; }
    public void setStats(DashboardStatsDto stats) { this.stats = stats; }
}