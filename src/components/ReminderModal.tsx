import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Clock, Calendar, Play } from 'lucide-react';
import { Task } from '../types/task';
import { calculateReminderSlots } from '../utils/reminders';
import { SoftButton } from './SoftButton';
import { sound } from '../utils/sound';

interface ReminderModalProps {
  task: Task | null;
  onClose: () => void;
  onTriggerTestAlert: (task: Task) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  task,
  onClose,
  onTriggerTestAlert,
}) => {
  if (!task) return null;

  const slots = calculateReminderSlots(task.deadlineEpochMillis, task.reminderConfig);
  const deadline = new Date(task.deadlineEpochMillis);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="w-full max-w-md bg-[#FCFAF7] rounded-[12px] p-6 soft-shadow-card border border-amber-900/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#E05D38] flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Proactive Reminder Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated alert schedule for this action
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {/* Task Snapshot */}
            <div className="p-3 bg-white rounded-[10px] border border-slate-200/80">
              <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                {task.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Deadline: {deadline.toLocaleString()}
              </p>
            </div>

            {/* Reminder Parameters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#FAF7F2] rounded-[8px] border border-amber-900/5">
                <span className="text-slate-500 block">Start Window</span>
                <span className="font-bold text-slate-800">
                  {task.reminderConfig.daysBefore} days prior
                </span>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] rounded-[8px] border border-amber-900/5">
                <span className="text-slate-500 block">Frequency</span>
                <span className="font-bold text-[#E05D38]">
                  {task.reminderConfig.frequencyPerDay}x daily
                </span>
              </div>
            </div>

            {/* Scheduled Timeline */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Upcoming Notification Slots ({slots.length})
              </h5>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {slots.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No upcoming reminder slots scheduled.
                  </p>
                ) : (
                  slots.map((slot) => (
                    <div
                      key={slot.slotIndex}
                      className="flex items-center justify-between p-2 bg-white rounded-[8px] border border-slate-200/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <span className="font-medium text-slate-800">
                            {slot.label}
                          </span>
                          <span className="text-slate-400 block text-[11px]">
                            {slot.scheduledTime.toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-[6px]">
                        Slot {slot.slotIndex}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Test Notification Simulator Button */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Simulate how Android delivers this alert
              </span>
              <SoftButton
                size="sm"
                variant="primary"
                onClick={() => {
                  sound.playNotificationChime();
                  onTriggerTestAlert(task);
                  onClose();
                }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Trigger Alert
              </SoftButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
