import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Clock, X } from 'lucide-react';
import { Task } from '../types/task';
import { sound } from '../utils/sound';

export interface ActiveNotification {
  id: string;
  task: Task;
  message: string;
  timestamp: Date;
}

interface NotificationToastProps {
  notification: ActiveNotification | null;
  onDismiss: () => void;
  onMarkDone: (task: Task) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onMarkDone,
}) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none"
        >
          <div className="bg-[#1E293B] text-white p-4 rounded-[12px] shadow-2xl border border-white/10 pointer-events-auto flex flex-col gap-3">
            {/* Header / Brand */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[6px] bg-[#E05D38] flex items-center justify-center text-white">
                  <Bell className="w-3 h-3" />
                </div>
                <span className="font-semibold text-slate-200">TatKraft Android Alert</span>
                <span>·</span>
                <span>Just now</span>
              </div>
              <button
                type="button"
                onClick={onDismiss}
                className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Body */}
            <div>
              <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                <span>⚡ {notification.task.title}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {notification.message}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onDismiss();
                }}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white font-medium rounded-[8px] hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Snooze 1h
              </button>
              <button
                type="button"
                onClick={() => {
                  onMarkDone(notification.task);
                  onDismiss();
                }}
                className="px-3 py-1.5 text-xs bg-[#2D7D63] hover:bg-[#256B54] text-white font-semibold rounded-[8px] transition-colors flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3" />
                Mark Completed
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
