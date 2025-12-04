import { EnumArea } from './EnumArea';
import { EnumParticipantStatus } from './EnumParticipantStatus';
import type { Evaluation } from './Evaluation';
import type { TimelineEvent } from './TimelineEvent';

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  area: EnumArea;
  batch: string;
  status: EnumParticipantStatus;
  evolution: number;
  startDate: Date;
  evaluations: Evaluation[];
  timeline: TimelineEvent[];
  skills: string[];
  bio: string;
}