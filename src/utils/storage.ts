import { Task } from '../types/task';

const STORAGE_KEY = 'tatkraft_tasks_v1';

const INITIAL_SEED_TASKS: Task[] = [
  {
    id: 'seed-task-1',
    title: 'Google Summer Software Engineering Internship',
    description: 'Submit resume, action-oriented project highlights, and custom technical statement.',
    category: 'INTERNSHIPS',
    deadlineEpochMillis: Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000, // in ~52 hours
    isCompleted: false,
    createdAtEpochMillis: Date.now() - 24 * 60 * 60 * 1000,
    priority: 'CRITICAL',
    reminderConfig: {
      isEnabled: true,
      daysBefore: 3,
      frequencyPerDay: 3,
    },
  },
  {
    id: 'seed-task-2',
    title: 'Masters Scholarship Statement of Purpose',
    description: 'Finalize 2-page essay on high-performance distributed systems and AI acceleration.',
    category: 'APPLICATIONS',
    deadlineEpochMillis: Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000, // in ~26 hours (Urgent!)
    isCompleted: false,
    createdAtEpochMillis: Date.now() - 12 * 60 * 60 * 1000,
    priority: 'CRITICAL',
    reminderConfig: {
      isEnabled: true,
      daysBefore: 3,
      frequencyPerDay: 3,
    },
  },
  {
    id: 'seed-task-3',
    title: 'Interactive Jetpack Compose Architecture Demo',
    description: 'Implement custom Soft UI Canvas elevation, spring press physics, and checkmark morphing.',
    category: 'PROJECTS',
    deadlineEpochMillis: Date.now() + 4 * 24 * 60 * 60 * 1000,
    isCompleted: false,
    createdAtEpochMillis: Date.now() - 48 * 60 * 60 * 1000,
    priority: 'HIGH',
    reminderConfig: {
      isEnabled: true,
      daysBefore: 2,
      frequencyPerDay: 2,
    },
  },
  {
    id: 'seed-task-4',
    title: 'Operating Systems Scheduling Benchmark Report',
    description: 'Profile thread pool latency under heavy concurrency workloads and render graph summaries.',
    category: 'STUDIES',
    deadlineEpochMillis: Date.now() - 6 * 60 * 60 * 1000, // Completed earlier
    isCompleted: true,
    completedAtEpochMillis: Date.now() - 3 * 60 * 60 * 1000,
    createdAtEpochMillis: Date.now() - 72 * 60 * 60 * 1000,
    priority: 'NORMAL',
    reminderConfig: {
      isEnabled: true,
      daysBefore: 1,
      frequencyPerDay: 1,
    },
  },
  {
    id: 'seed-task-5',
    title: 'Weekly TatKraft Review & Priority Mapping',
    description: 'Archive completed milestones and set top 3 non-negotiables for upcoming sprint.',
    category: 'PERSONAL',
    deadlineEpochMillis: Date.now() + 6 * 24 * 60 * 60 * 1000,
    isCompleted: false,
    createdAtEpochMillis: Date.now() - 10 * 60 * 60 * 1000,
    priority: 'NORMAL',
    reminderConfig: {
      isEnabled: true,
      daysBefore: 2,
      frequencyPerDay: 1,
    },
  },
];

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return INITIAL_SEED_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_TASKS));
      return INITIAL_SEED_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEED_TASKS;
  } catch {
    return INITIAL_SEED_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota
  }
}
