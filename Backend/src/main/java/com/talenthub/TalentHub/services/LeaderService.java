package com.talenthub.TalentHub.services;

import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.repositories.LeaderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
        return leaderRepository.save(newLeader);
    }
}
