import React from 'react';
import { motion } from 'motion/react';
import { Bell, Calendar, Edit3, Trash2 } from 'lucide-react';
import { Task, CATEGORIES } from '../types/task';
import { CelebrationCheckmark } from './CelebrationCheckmark';
import { SoftCard } from './SoftCard';
import { formatTimeRemaining, getReminderSummary } from '../utils/reminders';

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onInspectReminders: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleCompletion,
  onEdit,
  onDelete,
  onInspectReminders,
}) => {
  const categoryMeta = CATEGORIES[task.category] || CATEGORIES.INTERNSHIPS;
  const timeInfo = formatTimeRemaining(task.deadlineEpochMillis);
  const deadlineDate = new Date(task.deadlineEpochMillis);
  const formattedDate = deadlineDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SoftCard
      interactive
      className={`p-4 transition-all duration-200 border ${
        task.isCompleted
          ? 'opacity-65 bg-[#FAF7F2]/80 border-slate-200/50'
          : timeInfo.isUrgent
          ? 'border-amber-300/80 bg-white'
          : 'border-slate-200/70 bg-white'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Satisfying checkmark toggle */}
        <div className="pt-0.5">
          <CelebrationCheckmark
            isChecked={task.isCompleted}
            onToggle={() => onToggleCompletion(task)}
            size={28}
          />
        </div>

        {/* Task Details & Content */}
        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          {/* Metadata Row: Zero-pill discipline (clean text with typographic separators) */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            <span
              className="font-semibold"
              style={{ color: categoryMeta.accentColor }}
            >
              {categoryMeta.displayName}
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span
              className={`font-medium flex items-center gap-1 ${
                timeInfo.isOverdue
                  ? 'text-rose-600 font-semibold'
                  : timeInfo.isUrgent
                  ? 'text-[#E05D38] font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <Calendar className="w-3 h-3 inline" />
              {formattedDate} ({timeInfo.text})
            </span>
          </div>

          {/* Task Title */}
          <h3
            className={`text-base font-semibold mt-1 text-slate-800 leading-snug transition-all ${
              task.isCompleted ? 'line-through text-slate-400 font-normal' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Task Description */}
          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                task.isCompleted ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Proactive Reminder System Indicator */}
          {task.reminderConfig.isEnabled && !task.isCompleted && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectReminders(task);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#E05D38] hover:text-[#C74A25] font-medium bg-[#FFEBE5] hover:bg-[#FFE0D7] px-2.5 py-1 rounded-[8px] transition-colors"
                title="View proactive reminder timeline"
              >
                <Bell className="w-3 h-3" />
                <span>{getReminderSummary(task.reminderConfig)}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Action Icons (Edit / Delete) */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[8px] transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[8px] transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </SoftCard>
  );
};
