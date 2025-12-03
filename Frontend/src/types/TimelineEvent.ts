import { EnumTimelineEventType } from './EnumTimelineEventType';

export interface TimelineEvent {
  id: string;
  participantId: string;
  type: EnumTimelineEventType;
  title: string;
  description: string;
  date: Date;
  actorId?: string;
  actorName?: string;
}