import { ParticipantStatus, Area } from '@/types';

export const statusColors = {
  [ParticipantStatus.IN_TRAINING]: {
    color: '#1976d2',
    background: '#e3f2fd'
  },
  [ParticipantStatus.AVAILABLE]: {
    color: '#2e7d32',
    background: '#e8f5e8'
  },
  [ParticipantStatus.RESERVED]: {
    color: '#ed6c02',
    background: '#fff3e0'
  },
  [ParticipantStatus.HIRED]: {
    color: '#9c27b0',
    background: '#f3e5f5'
  }
};

export const areaColors = {
  [Area.DEVELOPMENT]: {
    color: '#1976d2',
    background: '#e3f2fd'
  },
  [Area.UX_DESIGN]: {
    color: '#9c27b0',
    background: '#f3e5f5'
  },
  [Area.QA]: {
    color: '#ed6c02',
    background: '#fff3e0'
  },
  [Area.DATA_SCIENCE]: {
    color: '#2e7d32',
    background: '#e8f5e8'
  },
  [Area.PRODUCT]: {
    color: '#d32f2f',
    background: '#ffebee'
  },
  [Area.MARKETING]: {
    color: '#0288d1',
    background: '#e1f5fe'
  }
};

export function getStatusLabel(status: ParticipantStatus): string {
  return status;
}

export function getAreaLabel(area: Area): string {
  return area;
}