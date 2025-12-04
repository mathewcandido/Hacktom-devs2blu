package com.talenthub.TalentHub.repositories;

import com.talenthub.TalentHub.models.Evaluations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluations, UUID> {
}
