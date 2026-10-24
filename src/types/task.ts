export type TaskCategoryType =
  | 'INTERNSHIPS'
  | 'PROJECTS'
  | 'APPLICATIONS'
  | 'STUDIES'
  | 'WORK'
  | 'PERSONAL';

export interface CategoryMeta {
  id: TaskCategoryType;
  displayName: string;
  accentColor: string;
  surfaceColor: string;
  badgeTextColor: string;
}

export const CATEGORIES: Record<TaskCategoryType, CategoryMeta> = {
  INTERNSHIPS: {
    id: 'INTERNSHIPS',
    displayName: 'Internships',
    accentColor: '#E05D38',
    surfaceColor: '#FFEBE5',
    badgeTextColor: '#B93815',
  },
  PROJECTS: {
    id: 'PROJECTS',
    displayName: 'Projects',
    accentColor: '#0284C7',
    surfaceColor: '#E0F2FE',
    badgeTextColor: '#0369A1',
  },
  APPLICATIONS: {
    id: 'APPLICATIONS',
    displayName: 'Applications',
    accentColor: '#2D7D63',
    surfaceColor: '#E6F5F0',
    badgeTextColor: '#1E5845',
  },
  STUDIES: {
    id: 'STUDIES',
    displayName: 'Studies',
    accentColor: '#7C3AED',
    surfaceColor: '#F3E8FF',
    badgeTextColor: '#6D28D9',
  },
  WORK: {
    id: 'WORK',
    displayName: 'Work',
    accentColor: '#D97706',
    surfaceColor: '#FEF3C7',
    badgeTextColor: '#B45309',
  },
  PERSONAL: {
    id: 'PERSONAL',
    displayName: 'Personal',
    accentColor: '#DB2777',
    surfaceColor: '#FCE7F3',
    badgeTextColor: '#BE185D',
  },
};

export interface ReminderConfig {
  isEnabled: boolean;
  daysBefore: number; // e.g. 1, 2, 3, 5, 7 days prior
  frequencyPerDay: number; // e.g. 1x, 2x, 3x per day
  customTimes?: string[]; // ["09:00", "14:00", "19:00"]
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategoryType;
  deadlineEpochMillis: number;
  isCompleted: boolean;
  completedAtEpochMillis?: number | null;
  createdAtEpochMillis: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  reminderConfig: ReminderConfig;
}

export interface ScheduledReminderSlot {
  slotIndex: number;
  scheduledTime: Date;
  daysRemainingAtTrigger: number;
  isPast: boolean;
  label: string;
}
