import { 
  Participant, 
  Leader, 
  Evaluation,
  TimelineEvent,
  EnumParticipantStatus,
  EnumArea,
  EnumEvaluationCategory,
  EnumTimelineEventType
} from '@/types';

// Dynamic data loading for both development and production
let participantsData: any = null;
let leadersData: any = null;
let evaluationsData: any = null;
let timelineEventsData: any = null;
let statsData: any = null;
let academyData: any = null;

// Load JSON data dynamically
const loadJsonData = async () => {
  if (typeof window !== 'undefined') {
    // Client-side loading
    if (!participantsData) {
      const [participants, leaders, evaluations, timeline, stats, academy] = await Promise.all([
        fetch('/data/participants.json').then(r => r.json()),
        fetch('/data/leaders.json').then(r => r.json()),
        fetch('/data/evaluations.json').then(r => r.json()),
        fetch('/data/timeline-events.json').then(r => r.json()),
        fetch('/data/stats.json').then(r => r.json()),
        fetch('/data/academy.json').then(r => r.json())
      ]);
      
      participantsData = participants;
      leadersData = leaders;
      evaluationsData = evaluations;
      timelineEventsData = timeline;
      statsData = stats;
      academyData = academy;
    }
  } else {
    // Server-side loading (for SSR)
    if (!participantsData) {
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.join(process.cwd(), 'public/data');
      participantsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'participants.json'), 'utf8'));
      leadersData = JSON.parse(fs.readFileSync(path.join(dataPath, 'leaders.json'), 'utf8'));
      evaluationsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'evaluations.json'), 'utf8'));
      timelineEventsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'timeline-events.json'), 'utf8'));
      statsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'stats.json'), 'utf8'));
      academyData = JSON.parse(fs.readFileSync(path.join(dataPath, 'academy.json'), 'utf8'));
    }
  }
};

// Simulation delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions to get related data
const getEvaluationsByParticipant = (participantId: string): Evaluation[] => {
  if (!evaluationsData || !leadersData) return [];
  
  return evaluationsData
    .filter((evaluation: any) => evaluation.participantId === participantId)
    .map((evaluation: any) => ({
      id: evaluation.id,
      participantId: evaluation.participantId,
      evaluatorId: evaluation.evaluatedBy,
      evaluatorName: leadersData.find((l: any) => l.id === evaluation.evaluatedBy)?.name || 'Avaliador',
      score: evaluation.score,
      feedback: evaluation.feedback,
      date: new Date(evaluation.evaluatedAt),
      category: evaluation.category as EnumEvaluationCategory
    }));
};

const getTimelineByParticipant = (participantId: string): TimelineEvent[] => {
  if (!timelineEventsData) return [];
  
  return timelineEventsData
    .filter((event: any) => event.participantId === participantId)
    .map((event: any) => ({
      ...event,
      type: event.type as EnumTimelineEventType,
      date: new Date(event.date)
    }));
};

// API Functions
export async function getParticipants(): Promise<Participant[]> {
  await loadJsonData();
  await delay(500);
  
  const batches = ['Turma 2024-1', 'Turma 2024-2', 'Turma 2023-2', 'Turma 2023-1', 'Turma 2022-2'];
  
  return participantsData.map((p: any, index: number) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    area: p.area as EnumArea,
    status: p.status as EnumParticipantStatus,
    startDate: new Date(p.joinDate),
    photo: p.avatar,
    phone: p.phone,
    batch: batches[index % batches.length], // Varia as turmas
    bio: `Participante da trilha ${p.area}`,
    skills: [],
    evolution: Math.floor(Math.random() * 50) + 50,
    evaluations: getEvaluationsByParticipant(p.id),
    timeline: getTimelineByParticipant(p.id)
  }));
}

export async function getParticipant(id: string): Promise<Participant | null> {
  await loadJsonData();
  await delay(300);
  
  console.log(`[API] Buscando participante com ID: ${id}`);
  
  const participant = participantsData.find((p: any) => p.id === id);
  
  if (!participant) {
    console.log(`[API] Participante não encontrado. IDs disponíveis:`, 
      participantsData.slice(0, 5).map(p => `${p.name}: ${p.id}`)
    );
    return null;
  }

  console.log(`[API] Participante encontrado: ${participant.name}`);
  
  const batches = ['Turma 2024-1', 'Turma 2024-2', 'Turma 2023-2', 'Turma 2023-1', 'Turma 2022-2'];
  const index = participantsData.findIndex(p => p.id === participant.id);
  
  return {
    id: participant.id,
    name: participant.name,
    email: participant.email,
    area: participant.area as EnumArea,
    status: participant.status as EnumParticipantStatus,
    startDate: new Date(participant.joinDate),
    photo: participant.avatar,
    phone: participant.phone,
    batch: batches[index % batches.length], // Varia as turmas
    bio: `Participante da trilha ${participant.area}`,
    skills: [],
    evolution: Math.floor(Math.random() * 50) + 50,
    evaluations: getEvaluationsByParticipant(participant.id),
    timeline: getTimelineByParticipant(participant.id)
  };
}

export async function getLeaders(): Promise<Leader[]> {
  await loadJsonData();
  await delay(400);
  
  return leadersData.map((leader: any, index: number) => {
    // Simula alguns interesses e reservas baseado no índice
    const interestedCount = Math.floor(Math.random() * 6); // 0-5 interessados
    const reservedCount = Math.floor(Math.random() * 4); // 0-3 reservados
    
    const interestedParticipants = [];
    const reservedParticipants = [];
    
    // Gera IDs fake baseados nos participantes disponíveis
    for (let i = 0; i < interestedCount; i++) {
      const randomParticipant = participantsData[Math.floor(Math.random() * participantsData.length)];
      if (randomParticipant && !interestedParticipants.includes(randomParticipant.id)) {
        interestedParticipants.push(randomParticipant.id);
      }
    }
    
    for (let i = 0; i < reservedCount; i++) {
      const randomParticipant = participantsData[Math.floor(Math.random() * participantsData.length)];
      if (randomParticipant && !reservedParticipants.includes(randomParticipant.id)) {
        reservedParticipants.push(randomParticipant.id);
      }
    }
    
    return {
      id: leader.id,
      name: leader.name,
      email: leader.email,
      photo: leader.avatar || '/default-avatar.jpg',
      area: leader.area as EnumArea,
      department: leader.department || 'Não especificado',
      interestedParticipants,
      reservedParticipants,
      joinDate: new Date(leader.joinDate || '2024-01-01')
    };
  });
}

export async function getLeader(id: string): Promise<Leader | null> {
  await loadJsonData();
  await delay(300);
  
  const leader = leadersData.find((l: any) => l.id === id);
  
  if (!leader) {
    return null;
  }

  return {
    id: leader.id,
    name: leader.name,
    email: leader.email,
    photo: leader.avatar,
    area: leader.area as EnumArea,
    department: leader.area,
    interestedParticipants: [],
    reservedParticipants: [],
    joinDate: new Date('2024-01-01')
  };
}

export async function getEvaluations(): Promise<Evaluation[]> {
  await loadJsonData();
  await delay(300);
  
  return evaluationsData.map((evaluation: any) => ({
    id: evaluation.id,
    participantId: evaluation.participantId,
    evaluatorId: evaluation.evaluatedBy,
      evaluatorName: leadersData?.find((l: any) => l.id === evaluation.evaluatedBy)?.name || 'Avaliador',
    score: evaluation.score,
    feedback: evaluation.feedback,
    date: new Date(evaluation.evaluatedAt),
    category: evaluation.category as EnumEvaluationCategory
  }));
}

export async function getDashboardStats() {
  await loadJsonData();
  await delay(200);
  
  return {
    totalParticipants: statsData.totalParticipants,
    activeParticipants: statsData.activeParticipants,
    totalLeaders: statsData.totalLeaders,
    averageScore: statsData.averageScore,
    areasDistribution: statsData.areasDistribution,
    completedProjects: statsData.completedProjects,
    inProgressProjects: statsData.inProgressProjects
  };
}

// Action functions
export async function markInterest(participantId: string, leaderId: string): Promise<void> {
  await delay(200);
  console.log(`Líder ${leaderId} marcou interesse no participante ${participantId}`);
}

export async function reserveParticipant(participantId: string, leaderId: string): Promise<void> {
  await delay(200);
  console.log(`Líder ${leaderId} reservou o participante ${participantId}`);
}

// Specific getData functions for each page
export async function getDashboardData() {
  await delay(300);
  const [participants, leaders, stats] = await Promise.all([
    getParticipants(),
    getLeaders(),
    getDashboardStats()
  ]);
  
  return { participants, leaders, stats };
}

export async function getParticipantsData() {
  await delay(300);
  const participants = await getParticipants();
  return { participants };
}

export async function getLeadersData() {
  await delay(300);
  const leaders = await getLeaders();
  return { leaders };
}

export async function getAcademyData() {
  await loadJsonData();
  await delay(200);
  return {
    courses: academyData.courses,
    upcomingEvents: academyData.upcomingEvents,
    resources: academyData.resources,
    stats: {
      totalCourses: academyData.courses.length,
      totalParticipants: academyData.courses.reduce((sum, course) => sum + course.participants, 0),
      activeCourses: academyData.courses.filter(c => c.status === 'active').length,
      upcomingEvents: academyData.upcomingEvents.length
    }
  };
}

export async function getParticipantData(id: string) {
  await delay(300);
  const participant = await getParticipant(id);
  return { participant };
}

// Debug utilities
export const clearParticipantsCache = () => {
  console.log('[API] Cache não utilizado - dados vêm diretamente dos JSONs');
};

export const getDataStats = async () => {
  await delay(100);
  
  return {
    participants: {
      total: participantsData.length,
      ids: participantsData.slice(0, 10).map(p => ({
        id: p.id,
        name: p.name
      }))
    },
    leaders: {
      total: leadersData.length,
      ids: leadersData.map(l => ({
        id: l.id,
        name: l.name
      }))
    },
    evaluations: {
      total: evaluationsData.length
    },
    timelineEvents: {
      total: timelineEventsData.length
    }
  };
};