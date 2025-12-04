package com.talenthub.TalentHub.services;

import com.talenthub.TalentHub.dto.LeaderDto;
import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.repositories.LeaderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaderService {
    private final LeaderRepository leaderRepository;

    public LeaderService(LeaderRepository leaderRepository) {
        this.leaderRepository = leaderRepository;
    }

    @Transactional(readOnly = true)
    public List<Leader> getAll(){
        return leaderRepository.findAll();
    }

    public Leader create(Leader leader){
        leader.setJoinDate(LocalDateTime.now());
        leader.setCreatedAt(LocalDateTime.now());
        return leaderRepository.save(leader);
    }

    public void delete(UUID id){
        Optional<Leader> oldLeader = leaderRepository.findById(id);
        if (oldLeader.isEmpty() || oldLeader == null)
            return;
        leaderRepository.deleteById(id);
    }

    public Leader update(UUID id, Leader leader){
        Optional<Leader> oldLeader = leaderRepository.findById(id);
        if (oldLeader.isEmpty() || oldLeader == null)
            return new Leader();
        Leader newLeader = leader;
        newLeader.setId(id);
        newLeader.setUpdatedAt(LocalDateTime.now());
        return leaderRepository.save(newLeader);
    }

    public List<LeaderDto> getAllLeaders() {
        List<Leader> leaders = leaderRepository.findAll();
        return leaders.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private LeaderDto convertToDto(Leader leader) {
        return new LeaderDto(
            leader.getId(),
            leader.getName(),
            leader.getEmail(),
            leader.getArea(),
            leader.getDepartment(),
            leader.getPhoto_url(),
            new ArrayList<>(), // interestedParticipants - implementar quando necessário
            new ArrayList<>()  // reservedParticipants - implementar quando necessário
        );
    }
}
