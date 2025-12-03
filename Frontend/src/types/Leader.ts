import { EnumArea } from './EnumArea';

export interface Leader {
  id: string;
  name: string;
  email: string;
  photo: string;
  area: EnumArea;
  department: string;
  interestedParticipants: string[];
  reservedParticipants: string[];
  joinDate: Date;
}