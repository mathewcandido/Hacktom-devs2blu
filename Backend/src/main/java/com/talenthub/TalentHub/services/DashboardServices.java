package com.talenthub.TalentHub.services;

import com.talenthub.TalentHub.dto.*;
import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.models.Participant;
import com.talenthub.TalentHub.models.enums.Status;
import com.talenthub.TalentHub.repositories.LeaderRepository;
import com.talenthub.TalentHub.repositories.ParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServices {
    private final LeaderRepository leaderRepository;
    private final ParticipantRepository participantRepository;

    public DashboardServices(LeaderRepository leaderRepository, ParticipantRepository participantRepository) {
        this.leaderRepository = leaderRepository;
        this.participantRepository = participantRepository;
    }

    public DashboardFullResponse getDashboardData() {
        // Buscar participants e converter para DTO
        List<Participant> participants = participantRepository.findAll();
        List<ParticipantDto> participantDtos = participants.stream()
            .map(this::convertParticipantToDto)
            .collect(java.util.stream.Collectors.toList());
        
        // Buscar leaders e converter para DTO  
        List<Leader> leaders = leaderRepository.findAll();
        List<LeaderDto> leaderDtos = leaders.stream()
            .map(this::convertLeaderToDto)
            .collect(java.util.stream.Collectors.toList());
        
        DashboardStatsDto stats = getDashboardStats();
        
        return new DashboardFullResponse(participantDtos, leaderDtos, stats);
    }

    private ParticipantDto convertParticipantToDto(Participant participant) {
        String statusText = convertStatusToText(participant.getStatus().toString());
        
        return new ParticipantDto(
            participant.getId(),
            participant.getName(),
            participant.getEmail(),
            participant.getArea(),
            statusText,
            participant.getEvolution() != null ? participant.getEvolution() : 0,
            participant.getBatch(),
            participant.getStartDate(),
            participant.getPhotoUrl(),
            participant.getPhone(),
            participant.getBio(),
            new java.util.ArrayList<>(), // skills
            new java.util.ArrayList<>(), // evaluations
            new java.util.ArrayList<>()  // timeline
        );
    }

    private LeaderDto convertLeaderToDto(Leader leader) {
        return new LeaderDto(
            leader.getId(),
            leader.getName(),
            leader.getEmail(),
            leader.getArea(),
            leader.getDepartment(),
            leader.getPhoto_url(),
            new java.util.ArrayList<>(), // interestedParticipants
            new java.util.ArrayList<>()  // reservedParticipants
        );
    }

    private String convertStatusToText(String status) {
        switch (status) {
            case "EM_FORMACAO": return "Em Formação";
            case "DISPONIVEL": return "Disponível";
            case "RESERVADO": return "Reservado";
            case "CONTRATADO": return "Contratado";
            default: return "Em Formação";
        }
    }

    public DashboardStatsDto getDashboardStats() {
        return new DashboardStatsDto(
            getTotalParticipants(),
            getAvailableParticipants(),
            getReservedParticipants(),
            getHiredParticipants(),
            getAverageEvolution()
        );
    }

    public DashboardResponse getInfoForDashboard(){
        DashboardResponse result = new DashboardResponse();
        result.setTotalParticipants(getTotalParticipants());
        result.setAvailableParticipants(getAvailableParticipants());
        result.setReservedParticipants(getReservedParticipants());
        result.setHiredParticipants(getHiredParticipants());
        result.setAverageEvolution(85.9);
        result.setActiveLeaders(getTotalLeaders());

        return result;
    }

    public Integer getTotalLeaders(){
        List<Leader> leaders = leaderRepository.findAll();
        return leaders.size();
    }

    public Integer getTotalParticipants(){
        List<Participant> participants = participantRepository.findAll();
        return participants.size();
    }

    public Integer getAvailableParticipants(){
        return participantRepository.getCountParticipantsByStatus(Status.DISPONIVEL);
    }

    public Integer getReservedParticipants(){
        return participantRepository.getCountParticipantsByStatus(Status.RESERVADO);
    }

    public Integer getHiredParticipants(){
        return participantRepository.getCountParticipantsByStatus(Status.CONTRATADO);
    }

    public Double getAverageEvolution() {
        List<Participant> participants = participantRepository.findAll();
        if (participants.isEmpty()) return 0.0;
        
        double sum = participants.stream()
            .mapToInt(p -> p.getEvolution() != null ? p.getEvolution() : 0)
            .sum();
        
        return sum / participants.size();
    }
}
