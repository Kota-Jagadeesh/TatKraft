import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Bell, Sparkles, Trash2 } from 'lucide-react';
import { Task, TaskCategoryType, CATEGORIES, ReminderConfig } from '../types/task';
import { SoftButton } from './SoftButton';
import { sound } from '../utils/sound';

interface TaskModalProps {
  isOpen: boolean;
  taskToEdit?: Task | null;
  onClose: () => void;
  onSave: (taskData: Partial<Task> & { title: string; category: TaskCategoryType; deadlineEpochMillis: number }) => void;
  onDelete?: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  taskToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategoryType>('INTERNSHIPS');
  const [deadlineDateStr, setDeadlineDateStr] = useState('');
  const [deadlineTimeStr, setDeadlineTimeStr] = useState('17:00');
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>({
    isEnabled: true,
    daysBefore: 3,
    frequencyPerDay: 3,
  });

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      const d = new Date(taskToEdit.deadlineEpochMillis);
      setDeadlineDateStr(d.toISOString().slice(0, 10));
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      setDeadlineTimeStr(`${hours}:${mins}`);
      setReminderConfig(taskToEdit.reminderConfig || {
        isEnabled: true,
        daysBefore: 3,
        frequencyPerDay: 3,
      });
    } else {
      // Default new task: deadline 3 days from now at 17:00
      const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      setTitle('');
      setDescription('');
      setCategory('INTERNSHIPS');
      setDeadlineDateStr(future.toISOString().slice(0, 10));
      setDeadlineTimeStr('17:00');
      setReminderConfig({
        isEnabled: true,
        daysBefore: 3,
        frequencyPerDay: 3,
      });
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleApplyQuickPreset = (daysAhead: number) => {
    sound.playClick();
    const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    setDeadlineDateStr(d.toISOString().slice(0, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadlineDateStr) return;

    const [year, month, day] = deadlineDateStr.split('-').map(Number);
    const [hours, minutes] = (deadlineTimeStr || '12:00').split(':').map(Number);
    const targetDate = new Date(year, month - 1, day, hours, minutes, 0);

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      deadlineEpochMillis: targetDate.getTime(),
      reminderConfig,
      isCompleted: taskToEdit ? taskToEdit.isCompleted : false,
      priority: 'HIGH',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="w-full max-w-lg bg-[#FCFAF7] rounded-[12px] p-6 soft-shadow-card border border-amber-900/10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {taskToEdit ? 'Edit Action Item' : 'New TatKraft Action'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set clear deadlines and stay ahead of procrastination
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Action Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer Software Engineering Internship Application"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05D38] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description & Deliverables
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key requirements, portfolio links, bullet points, or contacts..."
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05D38] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CATEGORIES) as TaskCategoryType[]).map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCategory(catKey);
                      }}
                      style={{
                        backgroundColor: isSelected ? cat.surfaceColor : '#FFFFFF',
                        borderColor: isSelected ? cat.accentColor : '#E2E8F0',
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-[10px] border transition-all text-left flex items-center justify-between ${
                        isSelected ? 'font-semibold shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span style={{ color: isSelected ? cat.badgeTextColor : undefined }}>
                        {cat.displayName}
                      </span>
                      {isSelected && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.accentColor }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deadline (Date & Time Picker + Presets) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Specific Deadline (Date & Time)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  value={deadlineDateStr}
                  onChange={(e) => setDeadlineDateStr(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05D38]"
                />
                <input
                  type="time"
                  required
                  value={deadlineTimeStr}
                  onChange={(e) => setDeadlineTimeStr(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05D38]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-500 font-medium">Quick set:</span>
                {[
                  { label: 'Tomorrow', days: 1 },
                  { label: '3 Days', days: 3 },
                  { label: '1 Week', days: 7 },
                  { label: '2 Weeks', days: 14 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyQuickPreset(preset.days)}
                    className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-[8px] hover:border-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Proactive Reminder Configuration */}
            <div className="p-3.5 bg-[#FAF7F2] rounded-[10px] border border-amber-900/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[6px] bg-[#E05D38] flex items-center justify-center text-white">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Proactive Anti-Procrastination Reminders
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pings you before deadline pressure builds
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderConfig.isEnabled}
                    onChange={(e) =>
                      setReminderConfig({ ...reminderConfig, isEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E05D38]"></div>
                </label>
              </div>

              {reminderConfig.isEnabled && (
                <div className="pt-2 border-t border-amber-900/10 space-y-2.5">
                  {/* Start Days Prior */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Start reminders prior to deadline:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 5, 7].map((days) => {
                        const isSel = reminderConfig.daysBefore === days;
                        return (
                          <button
                            key={days}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setReminderConfig({ ...reminderConfig, daysBefore: days });
                            }}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-[8px] border transition-colors ${
                              isSel
                                ? 'bg-[#E05D38] text-white border-[#E05D38] font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {days}d
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Frequency */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Daily notification frequency:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { count: 1, label: '1x / day' },
                        { count: 2, label: '2x / day' },
                        { count: 3, label: '3x / day' },
                      ].map((item) => {
                        const isSel = reminderConfig.frequencyPerDay === item.count;
                        return (
                          <button
                            key={item.count}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setReminderConfig({
                                ...reminderConfig,
                                frequencyPerDay: item.count,
                              });
                            }}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-[8px] border transition-colors ${
                              isSel
                                ? 'bg-[#2C3E50] text-white border-[#2C3E50] font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    ⚡ Scheduled: TatKraft will proactively alert you {reminderConfig.daysBefore} days before the deadline, {reminderConfig.frequencyPerDay} times daily.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
              {taskToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(taskToEdit);
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-[8px] transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}

              <div className="flex items-center gap-2">
                <SoftButton type="submit" variant="primary">
                  {taskToEdit ? 'Save Changes' : 'Create Task'}
                </SoftButton>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
