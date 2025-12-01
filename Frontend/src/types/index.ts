export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  area: Area;
  batch: string;
  status: ParticipantStatus;
  evolution: number;
  startDate: Date;
  evaluations: Evaluation[];
  timeline: TimelineEvent[];
  skills: string[];
  bio: string;
}

export interface Leader {
  id: string;
  name: string;
  email: string;
  photo: string;
  area: Area;
  department: string;
  interestedParticipants: string[];
  reservedParticipants: string[];
  joinDate: Date;
}

export interface Evaluation {
  id: string;
  participantId: string;
  evaluatorId: string;
  evaluatorName: string;
  score: number;
  feedback: string;
  date: Date;
  category: EvaluationCategory;
}

export interface TimelineEvent {
  id: string;
  participantId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: Date;
  actorId?: string;
  actorName?: string;
}

export enum Area {
  DEVELOPMENT = 'Desenvolvimento',
  UX_DESIGN = 'UX/UI Design',
  QA = 'Quality Assurance',
  DATA_SCIENCE = 'Data Science',
  PRODUCT = 'Product Management',
  MARKETING = 'Marketing Digital'
}

export enum ParticipantStatus {
  IN_TRAINING = 'Em Formação',
  AVAILABLE = 'Disponível',
  RESERVED = 'Reservado',
  HIRED = 'Contratado'
}

export enum EvaluationCategory {
  TECHNICAL = 'Técnica',
  SOFT_SKILLS = 'Soft Skills',
  LEADERSHIP = 'Liderança',
  COMMUNICATION = 'Comunicação'
}

export enum TimelineEventType {
  ENROLLMENT = 'Inscrição',
  EVALUATION = 'Avaliação',
  INTEREST = 'Interesse de Líder',
  RESERVATION = 'Reserva',
  GRADUATION = 'Formatura',
  HIRING = 'Contratação'
}