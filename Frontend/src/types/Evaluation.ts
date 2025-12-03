import { EnumEvaluationCategory } from './EnumEvaluationCategory';

export interface Evaluation {
  id: string;
  participantId: string;
  evaluatorId: string;
  evaluatorName: string;
  score: number;
  feedback: string;
  date: Date;
  category: EnumEvaluationCategory;
}