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

// Import JSON data
import participantsData from '../mocks/data/participants.json';
import leadersData from '../mocks/data/leaders.json';
import evaluationsData from '../mocks/data/evaluations.json';
import timelineEventsData from '../mocks/data/timeline-events.json';
import statsData from '../mocks/data/stats.json';
import academyData from '../mocks/data/academy.json';

// Simulation delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions to get related data
const getEvaluationsByParticipant = (participantId: string): Evaluation[] => {
  return evaluationsData
    .filter(evaluation => evaluation.participantId === participantId)
    .map(evaluation => ({
      id: evaluation.id,
      participantId: evaluation.participantId,
      evaluatorId: evaluation.evaluatedBy,
      evaluatorName: leadersData.find(l => l.id === evaluation.evaluatedBy)?.name || 'Avaliador',
      score: evaluation.score,
      feedback: evaluation.feedback,
      date: new Date(evaluation.evaluatedAt),
      category: evaluation.category as EnumEvaluationCategory
    }));
};

const getTimelineByParticipant = (participantId: string): TimelineEvent[] => {
  return timelineEventsData
    .filter(event => event.participantId === participantId)
    .map(event => ({
      ...event,
      type: event.type as EnumTimelineEventType,
      date: new Date(event.date)
    }));
};

// API Functions
export async function getParticipants(): Promise<Participant[]> {
  await delay(500);
  
  return participantsData.map(p => ({
    id: p.id,
    name: p.name,
    email: p.email,
    area: p.area as EnumArea,
    status: p.status as EnumParticipantStatus,
    startDate: new Date(p.joinDate),
    photo: p.avatar,
    phone: p.phone,
    batch: '2024-1',
    bio: `Participante da trilha ${p.area}`,
    skills: [],
    evolution: 0,
    evaluations: getEvaluationsByParticipant(p.id),
    timeline: getTimelineByParticipant(p.id)
  }));
}

export async function getParticipant(id: string): Promise<Participant | null> {
  await delay(300);
  
  console.log(`[API] Buscando participante com ID: ${id}`);
  
  const participant = participantsData.find(p => p.id === id);
  
  if (!participant) {
    console.log(`[API] Participante não encontrado. IDs disponíveis:`, 
      participantsData.slice(0, 5).map(p => `${p.name}: ${p.id}`)
    );
    return null;
  }

  console.log(`[API] Participante encontrado: ${participant.name}`);
  
  return {
    id: participant.id,
    name: participant.name,
    email: participant.email,
    area: participant.area as EnumArea,
    status: participant.status as EnumParticipantStatus,
    startDate: new Date(participant.joinDate),
    photo: participant.avatar,
    phone: participant.phone,
    batch: '2024-1',
    bio: `Participante da trilha ${participant.area}`,
    skills: [],
    evolution: 0,
    evaluations: getEvaluationsByParticipant(participant.id),
    timeline: getTimelineByParticipant(participant.id)
  };
}

export async function getLeaders(): Promise<Leader[]> {
  await delay(400);
  
  return leadersData.map(leader => ({
    id: leader.id,
    name: leader.name,
    email: leader.email,
    photo: leader.avatar,
    area: leader.area as EnumArea,
    department: leader.area,
    interestedParticipants: [],
    reservedParticipants: [],
    joinDate: new Date('2024-01-01')
  }));
}

export async function getLeader(id: string): Promise<Leader | null> {
  await delay(300);
  
  const leader = leadersData.find(l => l.id === id);
  
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
  await delay(300);
  
  return evaluationsData.map(evaluation => ({
    id: evaluation.id,
    participantId: evaluation.participantId,
    evaluatorId: evaluation.evaluatedBy,
    evaluatorName: leadersData.find(l => l.id === evaluation.evaluatedBy)?.name || 'Avaliador',
    score: evaluation.score,
    feedback: evaluation.feedback,
    date: new Date(evaluation.evaluatedAt),
    category: evaluation.category as EnumEvaluationCategory
  }));
}

export async function getDashboardStats() {
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