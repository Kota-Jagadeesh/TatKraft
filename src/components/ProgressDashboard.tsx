import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, AlertTriangle, Flame, ArrowUpRight } from 'lucide-react';
import { Task, CATEGORIES, TaskCategoryType } from '../types/task';
import { SoftCard } from './SoftCard';

interface ProgressDashboardProps {
  tasks: Task[];
  onSelectCategoryFilter?: (category: TaskCategoryType | null) => void;
  onFilterUrgent?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  tasks,
  onSelectCategoryFilter,
  onFilterUrgent,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Urgent tasks: due within next 48 hours and not completed
  const now = Date.now();
  const urgentTasks = tasks.filter((t) => {
    if (t.isCompleted) return false;
    const diff = t.deadlineEpochMillis - now;
    return diff > 0 && diff <= 48 * 60 * 60 * 1000;
  });

  const overdueTasks = tasks.filter((t) => !t.isCompleted && t.deadlineEpochMillis < now);

  // Group by category
  const categoryCounts = (Object.keys(CATEGORIES) as TaskCategoryType[]).map((catKey) => {
    const matching = tasks.filter((t) => t.category === catKey);
    const catCompleted = matching.filter((t) => t.isCompleted).length;
    return {
      catKey,
      meta: CATEGORIES[catKey],
      total: matching.length,
      completed: catCompleted,
      percentage: matching.length > 0 ? Math.round((catCompleted / matching.length) * 100) : 0,
    };
  });

  // Circular arc calculation (radius 36, circumference 2 * pi * 36 = 226.2)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * completionPercentage) / 100;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Progress Arc */}
      <SoftCard className="p-6 bg-white border border-slate-200/70">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E05D38]">
              TatKraft Momentum Meter
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">
              {completionPercentage >= 80
                ? 'Conquering the Backlog! 🔥'
                : completionPercentage >= 50
                ? 'Great Momentum Building ⚡'
                : 'Initiate Action Today 🎯'}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md leading-relaxed">
              {completionPercentage >= 80
                ? 'Your disciplined execution has cleared the vast majority of critical milestones.'
                : 'Break the resistance barrier. A 15-minute focused sprint builds exponential momentum.'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {completedTasks} Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                {pendingTasks} Pending
              </span>
              {urgentTasks.length > 0 && (
                <span className="flex items-center gap-1.5 text-[#E05D38]">
                  <Flame className="w-3.5 h-3.5" />
                  {urgentTasks.length} Urgent (&lt;48h)
                </span>
              )}
            </div>
          </div>

          {/* Fluid SVG Progress Arc Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="104" height="104" className="rotate-[-90deg]">
              {/* Background ring */}
              <circle
                cx="52"
                cy="52"
                r={radius}
                stroke="#F1EBE4"
                strokeWidth="8"
                fill="none"
              />
              {/* Animated Progress Arc */}
              <motion.circle
                cx="52"
                cy="52"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E05D38" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-800 tabular-nums">
                {completionPercentage}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Rate
              </span>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Overall Task Pipeline</span>
            <span className="tabular-nums font-semibold text-slate-700">
              {completedTasks} / {totalTasks} Tasks
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-black/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E05D38] via-[#0284C7] to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </SoftCard>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SoftCard className="p-3.5 bg-white border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800 tabular-nums">
            {totalTasks}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Managed actions</span>
        </SoftCard>

        <SoftCard className="p-3.5 bg-white border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 tabular-nums">
            {completedTasks}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Finished deliverables</span>
        </SoftCard>

        <SoftCard className="p-3.5 bg-white border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Pending</span>
            <Clock className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0284C7] tabular-nums">
            {pendingTasks}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">In flow pipeline</span>
        </SoftCard>

        <SoftCard
          interactive={urgentTasks.length > 0}
          onClick={onFilterUrgent}
          className={`p-3.5 border ${
            urgentTasks.length > 0
              ? 'bg-[#FFEBE5]/60 border-[#E05D38]/30 cursor-pointer'
              : 'bg-white border-slate-200/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Urgent (&lt;48h)</span>
            <AlertTriangle
              className={`w-4 h-4 ${
                urgentTasks.length > 0 ? 'text-[#E05D38]' : 'text-slate-400'
              }`}
            />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#E05D38] tabular-nums">
            {urgentTasks.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block flex items-center justify-between">
            <span>High priority</span>
            {urgentTasks.length > 0 && <ArrowUpRight className="w-3 h-3 text-[#E05D38]" />}
          </span>
        </SoftCard>
      </div>

      {/* Category Breakdown */}
      <SoftCard className="p-5 bg-white border border-slate-200/70">
        <h3 className="text-sm font-bold text-slate-800 mb-3">
          Milestones by Category
        </h3>
        <div className="space-y-3">
          {categoryCounts.map((item) => {
            if (item.total === 0) return null;
            return (
              <div
                key={item.catKey}
                onClick={() => onSelectCategoryFilter?.(item.catKey)}
                className="group cursor-pointer p-2 rounded-[8px] hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-slate-900 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.meta.accentColor }}
                    />
                    {item.meta.displayName}
                  </span>
                  <span className="text-slate-500 tabular-nums">
                    {item.completed} / {item.total} done ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-black/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.meta.accentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SoftCard>
    </div>
  );
};
