package com.talenthub.TalentHub.services;

import com.talenthub.TalentHub.dto.DashboardResponse;
import com.talenthub.TalentHub.models.Participant;
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

    public DashboardResponse getInfoForDashboard(){
        DashboardResponse result = new DashboardResponse();
        result.setTotalParticipants(getTotalParticipants());
        result.setAvailableParticipants(getAvailableParticipants());
        result.setReservedPaticipants(getReservedParticipants());
        result.setHiredParticipants(getHiredParticipants());
        return result;
    }

    public Integer getTotalParticipants(){
        List<Participant> participants = participantRepository.findAll();
        return participants.size();
    }

    public Integer getAvailableParticipants(){
        return participantRepository.getCountParticipantsByStatus(1);
    }

    public Integer getReservedParticipants(){
        return participantRepository.getCountParticipantsByStatus(2);
    }

    public Integer getHiredParticipants(){
        return participantRepository.getCountParticipantsByStatus(3);
    }




}
