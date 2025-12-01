import { Participant, Leader } from '@/types';
import { generateParticipants } from '@/mocks/generateParticipants';
import { generateLeaders } from '@/mocks/generateLeaders';

const PARTICIPANTS_KEY = 'talent-incubator-participants';
const LEADERS_KEY = 'talent-incubator-leaders';

export async function getParticipants(): Promise<Participant[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(PARTICIPANTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        evaluations: p.evaluations.map((e: any) => ({
          ...e,
          date: new Date(e.date)
        })),
        timeline: p.timeline.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }))
      }));
    }
  }

  const participants = generateParticipants(35);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
  }

  return participants;
}

export async function getParticipant(id: string): Promise<Participant | null> {
  const participants = await getParticipants();
  return participants.find(p => p.id === id) || null;
}

export async function getLeaders(): Promise<Leader[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LEADERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((l: any) => ({
        ...l,
        joinDate: new Date(l.joinDate)
      }));
    }
  }

  const leaders = generateLeaders(8);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(LEADERS_KEY, JSON.stringify(leaders));
  }

  return leaders;
}

export async function markInterest(participantId: string, leaderId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Líder ${leaderId} marcou interesse no participante ${participantId}`);
}

export async function reserveParticipant(participantId: string, leaderId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Líder ${leaderId} reservou o participante ${participantId}`);
}