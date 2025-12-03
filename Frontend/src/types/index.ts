// Export interfaces
export type { Participant } from './Participant';
export type { Leader } from './Leader';
export type { Evaluation } from './Evaluation';
export type { TimelineEvent } from './TimelineEvent';
export type { User, LoginCredentials, AuthState, AuthContextType } from './Auth';

// Export enums
export { EnumArea } from './EnumArea';
export { EnumParticipantStatus } from './EnumParticipantStatus';
export { EnumEvaluationCategory } from './EnumEvaluationCategory';
export { EnumTimelineEventType } from './EnumTimelineEventType';

// Export legacy enums for backward compatibility (deprecated)
/** @deprecated Use EnumArea instead */
export { EnumArea as Area } from './EnumArea';
/** @deprecated Use EnumParticipantStatus instead */
export { EnumParticipantStatus as ParticipantStatus } from './EnumParticipantStatus';
/** @deprecated Use EnumEvaluationCategory instead */
export { EnumEvaluationCategory as EvaluationCategory } from './EnumEvaluationCategory';
/** @deprecated Use EnumTimelineEventType instead */
export { EnumTimelineEventType as TimelineEventType } from './EnumTimelineEventType';