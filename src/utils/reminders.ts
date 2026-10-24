import { ReminderConfig, ScheduledReminderSlot, Task } from '../types/task';

/**
 * Calculates proactive notification slots for a task based on its ReminderConfig.
 */
export function calculateReminderSlots(
  deadlineEpochMillis: number,
  config: ReminderConfig
): ScheduledReminderSlot[] {
  if (!config.isEnabled) return [];

  const now = Date.now();
  const deadline = deadlineEpochMillis;
  if (deadline <= now) return [];

  const daysPriorMillis = config.daysBefore * 24 * 60 * 60 * 1000;
  const reminderStartEpoch = deadline - daysPriorMillis;
  const effectiveStartEpoch = Math.max(now, reminderStartEpoch);

  const totalDuration = deadline - effectiveStartEpoch;
  if (totalDuration <= 0) return [];

  const freq = Math.max(1, config.frequencyPerDay);
  const totalDays = Math.max(1, Math.ceil((deadline - now) / (24 * 60 * 60 * 1000)));
  const totalSlots = Math.min(12, Math.max(1, totalDays * freq));
  const stepMillis = totalDuration / (totalSlots + 1);

  const slots: ScheduledReminderSlot[] = [];

  for (let i = 1; i <= totalSlots; i++) {
    const triggerTimeEpoch = effectiveStartEpoch + i * stepMillis;
    const daysRemaining = Math.max(0, Math.ceil((deadline - triggerTimeEpoch) / (24 * 60 * 60 * 1000)));
    const date = new Date(triggerTimeEpoch);

    let label = '';
    if (daysRemaining === 0) {
      label = 'Deadline Day Morning Call';
    } else if (daysRemaining === 1) {
      label = '1 Day Left Final Checkpoint';
    } else {
      label = `${daysRemaining} Days Left Focus Ping`;
    }

    slots.push({
      slotIndex: i,
      scheduledTime: date,
      daysRemainingAtTrigger: daysRemaining,
      isPast: triggerTimeEpoch <= now,
      label,
    });
  }

  return slots;
}

/**
 * Formats time remaining until deadline into human readable string.
 */
export function formatTimeRemaining(deadlineEpochMillis: number): {
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
  hours: number;
} {
  const now = Date.now();
  const diffMillis = deadlineEpochMillis - now;

  if (diffMillis < 0) {
    const overdueHours = Math.abs(Math.floor(diffMillis / (1000 * 60 * 60)));
    return {
      text: overdueHours < 24 ? `${overdueHours}h overdue` : `${Math.floor(overdueHours / 24)}d overdue`,
      isUrgent: true,
      isOverdue: true,
      hours: -overdueHours,
    };
  }

  const hours = Math.floor(diffMillis / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours <= 24) {
    return {
      text: hours === 0 ? 'Due within an hour!' : `${hours}h remaining`,
      isUrgent: true,
      isOverdue: false,
      hours,
    };
  } else if (days <= 2) {
    return {
      text: `${days}d ${hours % 24}h left`,
      isUrgent: true,
      isOverdue: false,
      hours,
    };
  } else {
    return {
      text: `${days} days left`,
      isUrgent: false,
      isOverdue: false,
      hours,
    };
  }
}

/**
 * Summary string for a task's reminder configuration.
 */
export function getReminderSummary(config: ReminderConfig): string {
  if (!config.isEnabled) return 'Reminders Off';
  const dayStr =
    config.daysBefore === 0
      ? 'Day of deadline'
      : config.daysBefore === 1
      ? '1 day prior'
      : `${config.daysBefore} days prior`;
  const freqStr = `${config.frequencyPerDay}x daily`;
  return `Starts ${dayStr} · ${freqStr}`;
}
