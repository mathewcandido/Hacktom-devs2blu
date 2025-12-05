import { Leader, Participant, EnumArea, EnumParticipantStatus, MatchResult } from "@/types";

export class MatchingService {
  private participants: Participant[];
  private leaders: Leader[];

  constructor(participants: Participant[], leaders: Leader[]) {
    this.participants = participants;
    this.leaders = leaders;
  }

  static calculateMatch(leader: Leader, participant: Participant): MatchResult {
    let score = 0;
    const reasons: string[] = [];

    // 1. Área de especialização (peso 40%)
    if (leader.area === participant.area) {
      score += 40;
      reasons.push(`Mesma área: ${participant.area}`);
    } else {
      score += 10;
      reasons.push('Áreas diferentes - oportunidade de diversificação');
    }

    // 2. Department/Experience match (peso 30%) - Simplificado para MVP
    const departmentScore = leader.department ? 30 : 15;
    score += departmentScore;
    
    if (leader.department) {
      reasons.push(`Líder experiente: ${leader.department}`);
    }

    // 3. Evolução do participante (peso 20%)
    const evolutionScore = (participant.evolution / 100) * 20;
    score += evolutionScore;
    
    if (participant.evolution >= 80) {
      reasons.push(`Alta evolução: ${participant.evolution}%`);
    } else if (participant.evolution >= 60) {
      reasons.push(`Boa evolução: ${participant.evolution}%`);
    }

    // 4. Status do participante (peso 10%)
    if (participant.status === EnumParticipantStatus.AVAILABLE) {
      score += 10;
      reasons.push('Disponível para contratação');
    } else if (participant.status === EnumParticipantStatus.RESERVED) {
      score += 5;
      reasons.push('Reservado - ainda negociável');
    }

    // Determinar compatibilidade
    let compatibility: 'high' | 'medium' | 'low';
    if (score >= 70) compatibility = 'high';
    else if (score >= 50) compatibility = 'medium';
    else compatibility = 'low';

    return {
      participantId: participant.id,
      leaderId: leader.id,
      participant,
      leader,
      score: Math.round(score),
      reasons,
      compatibility
    };
  }

  static findBestMatches(
    leaders: Leader[], 
    participants: Participant[], 
    limit: number = 10
  ): MatchResult[] {
    const matches: MatchResult[] = [];

    leaders.forEach(leader => {
      participants.forEach(participant => {
        const match = this.calculateMatch(leader, participant);
        matches.push(match);
      });
    });

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  static getMatchesForLeader(
    leader: Leader, 
    participants: Participant[], 
    limit: number = 5
  ): MatchResult[] {
    return participants
      .map(participant => this.calculateMatch(leader, participant))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  static getMatchesForParticipant(
    participant: Participant, 
    leaders: Leader[], 
    limit: number = 5
  ): MatchResult[] {
    return leaders
      .map(leader => this.calculateMatch(leader, participant))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Instance methods
  getMatchesForLeader(leaderId: string, limit: number = 5): MatchResult[] {
    const leader = this.leaders.find(l => l.id === leaderId);
    if (!leader) return [];

    const matches = this.participants
      .map(participant => MatchingService.calculateMatch(leader, participant))
      .sort((a, b) => b.score - a.score);
    
    const uniqueMatches = this.removeDuplicateMatches(matches);
    const uniqueNameMatches = this.filterUniqueParticipantNames(uniqueMatches);
    return uniqueNameMatches.slice(0, limit);
  }

  getMatchesForParticipant(participantId: string, limit: number = 5): MatchResult[] {
    const participant = this.participants.find(p => p.id === participantId);
    if (!participant) return [];

    return this.leaders
      .map(leader => MatchingService.calculateMatch(leader, participant))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getAllMatches(): MatchResult[] {
    const matches: MatchResult[] = [];

    this.leaders.forEach(leader => {
      this.participants.forEach(participant => {
        const match = MatchingService.calculateMatch(leader, participant);
        matches.push(match);
      });
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  getBestMatches(limit: number = 10): MatchResult[] {
    const allMatches = this.getAllMatches();
    const uniqueMatches = this.removeDuplicateMatches(allMatches);
    const uniqueNameMatches = this.filterUniqueParticipantNames(uniqueMatches);
    return uniqueNameMatches.slice(0, limit);
  }

  // Método privado para remover matches duplicados
  private removeDuplicateMatches(matches: MatchResult[]): MatchResult[] {
    const seen = new Set<string>();
    return matches.filter(match => {
      const key = `${match.participantId}-${match.leaderId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Método público para validar se há duplicatas
  static validateNoDuplicates(matches: MatchResult[]): boolean {
    const seen = new Set<string>();
    for (const match of matches) {
      const key = `${match.participantId}-${match.leaderId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
    }
    return true;
  }

  // Método para garantir nomes únicos de participantes nos matches
  private filterUniqueParticipantNames(matches: MatchResult[]): MatchResult[] {
    const seenParticipantNames = new Set<string>();
    const seenLeaderNames = new Set<string>();
    
    return matches.filter(match => {
      const participantName = match.participant.name.toLowerCase().trim();
      const leaderName = match.leader.name.toLowerCase().trim();
      
      // Verifica se já vimos este nome de participante
      if (seenParticipantNames.has(participantName)) {
        return false;
      }
      
      // Verifica se já vimos este nome de líder
      if (seenLeaderNames.has(leaderName)) {
        return false;
      }
      
      // Verifica se o participante e líder têm o mesmo nome
      if (participantName === leaderName) {
        return false;
      }
      
      seenParticipantNames.add(participantName);
      seenLeaderNames.add(leaderName);
      return true;
    });
  }

  // Método para validar se há nomes duplicados
  static validateUniqueNames(matches: MatchResult[]): boolean {
    const participantNames = new Set<string>();
    const leaderNames = new Set<string>();
    
    for (const match of matches) {
      const participantName = match.participant.name.toLowerCase().trim();
      const leaderName = match.leader.name.toLowerCase().trim();
      
      if (participantNames.has(participantName) || 
          leaderNames.has(leaderName) || 
          participantName === leaderName) {
        return false;
      }
      
      participantNames.add(participantName);
      leaderNames.add(leaderName);
    }
    
    return true;
  }

  // Método para debug - listar todos os nomes nos matches
  static debugMatchNames(matches: MatchResult[], context: string = ''): void {
    console.log(`🔍 DEBUG ${context}: Análise de nomes nos matches`);
    
    const participantNames: string[] = [];
    const leaderNames: string[] = [];
    const duplicates: string[] = [];
    
    matches.forEach((match, index) => {
      const pName = match.participant.name;
      const lName = match.leader.name;
      
      if (participantNames.includes(pName) || leaderNames.includes(lName) || pName === lName) {
        duplicates.push(`Match ${index + 1}: ${pName} ↔ ${lName}`);
      }
      
      participantNames.push(pName);
      leaderNames.push(lName);
    });
    
    console.log(`📊 Total de matches: ${matches.length}`);
    console.log(`👥 Participantes únicos: ${new Set(participantNames).size}/${participantNames.length}`);
    console.log(`👔 Líderes únicos: ${new Set(leaderNames).size}/${leaderNames.length}`);
    
    if (duplicates.length > 0) {
      console.warn(`⚠️ Duplicatas encontradas:`, duplicates);
    } else {
      console.log(`✅ Todos os nomes são únicos!`);
    }
  }
}

// Utility functions
export const getCompatibilityColor = (compatibility: string) => {
  switch (compatibility) {
    case 'high': return '#2e7d32';
    case 'medium': return '#ed6c02'; 
    case 'low': return '#d32f2f';
    default: return '#666';
  }
};

export const getCompatibilityLabel = (compatibility: string) => {
  switch (compatibility) {
    case 'high': return 'Alto Match';
    case 'medium': return 'Médio Match';
    case 'low': return 'Baixo Match';
    default: return 'Sem Match';
  }
};