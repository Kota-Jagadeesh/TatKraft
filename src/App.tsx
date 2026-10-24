/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  Smartphone,
  Maximize2,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
  Bell,
} from 'lucide-react';
import { Task, TaskCategoryType, CATEGORIES } from './types/task';
import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';
import { sound } from './utils/sound';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { ReminderModal } from './components/ReminderModal';
import { ProgressDashboard } from './components/ProgressDashboard';
import { KotlinCodeViewer } from './components/KotlinCodeViewer';
import { NotificationToast, ActiveNotification } from './components/NotificationToast';
import { SplashOpeningAnimation } from './components/SplashOpeningAnimation';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { SoftButton } from './components/SoftButton';
import { SoftCard } from './components/SoftCard';

type ActiveTab = 'tasks' | 'dashboard' | 'code';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategoryType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [inspectingReminderTask, setInspectingReminderTask] = useState<Task | null>(null);

  // Simulated Heads-up Push Notification
  const [activeNotification, setActiveNotification] = useState<ActiveNotification | null>(null);

  // Persist tasks on change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.setSoundEnabled(nextState);
    if (nextState) {
      sound.playClick();
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    const now = Date.now();
    return tasks.filter((task) => {
      // Category match
      if (selectedCategory && task.category !== selectedCategory) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      // Urgent only filter (<48h and pending)
      if (urgentOnly) {
        if (task.isCompleted) return false;
        const diff = task.deadlineEpochMillis - now;
        if (diff < 0 || diff > 48 * 60 * 60 * 1000) return false;
      }
      return true;
    });
  }, [tasks, selectedCategory, searchQuery, urgentOnly]);

  // Task Handlers
  const handleToggleTask = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          const willComplete = !t.isCompleted;
          return {
            ...t,
            isCompleted: willComplete,
            completedAtEpochMillis: willComplete ? Date.now() : null,
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (
    taskData: Partial<Task> & {
      title: string;
      category: TaskCategoryType;
      deadlineEpochMillis: number;
    }
  ) => {
    sound.playClick();
    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
    } else {
      // Create new
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: taskData.title,
        description: taskData.description || '',
        category: taskData.category,
        deadlineEpochMillis: taskData.deadlineEpochMillis,
        isCompleted: false,
        createdAtEpochMillis: Date.now(),
        priority: taskData.priority || 'HIGH',
        reminderConfig: taskData.reminderConfig || {
          isEnabled: true,
          daysBefore: 3,
          frequencyPerDay: 3,
        },
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (task: Task) => {
    sound.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  // Trigger simulated notification
  const handleTriggerTestAlert = (task: Task) => {
    sound.playNotificationChime();
    const deadline = new Date(task.deadlineEpochMillis);
    setActiveNotification({
      id: `notif-${Date.now()}`,
      task,
      message: `Proactive reminder: Due on ${deadline.toLocaleDateString()} at ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Focus for 20 minutes to maintain momentum!`,
      timestamp: new Date(),
    });
  };

  const urgentCount = tasks.filter((t) => {
    if (t.isCompleted) return false;
    const diff = t.deadlineEpochMillis - Date.now();
    return diff > 0 && diff <= 48 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-slate-800 flex flex-col selection:bg-[#FFEBE5] selection:text-[#E05D38]">
      {/* Simulated Android Heads-up Push Notification */}
      <NotificationToast
        notification={activeNotification}
        onDismiss={() => setActiveNotification(null)}
        onMarkDone={(t) => handleToggleTask(t)}
      />

      {/* Top Bar Contract (1-row, 3-zone layout) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark with Logo Avatar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/public/assets/aistudio/image_ecd9de76.png"
              alt="TatKraft Brand Logo"
              className="w-8 h-8 rounded-[8px] object-cover shadow-sm"
              onError={(e) => {
                // Resilient CSS fallback container per design constitution
                e.currentTarget.style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-[#E05D38] transition-colors"
            >
              TatKraft
            </button>
          </div>

          {/* Zone 2: 4-5 single-line clean text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('tasks');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tasks' ? 'text-[#E05D38] font-bold border-b-2 border-[#E05D38] pb-1' : ''
              }`}
            >
              Action Items ({tasks.filter((t) => !t.isCompleted).length})
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('dashboard');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard' ? 'text-[#E05D38] font-bold border-b-2 border-[#E05D38] pb-1' : ''
              }`}
            >
              Momentum Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('code');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'code' ? 'text-[#E05D38] font-bold border-b-2 border-[#E05D38] pb-1' : ''
              }`}
            >
              Kotlin Jetpack Compose Code
            </button>
            <button
              type="button"
              onClick={() => {
                const sampleTask = tasks.find((t) => !t.isCompleted) || tasks[0];
                if (sampleTask) handleTriggerTestAlert(sampleTask);
              }}
              className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-[#E05D38]" />
              Simulate Alert
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-black/5 rounded-[8px] transition-colors"
              title={soundEnabled ? 'Mute tactile sounds' : 'Enable tactile sounds'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-slate-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Replay Intro Opening Animation Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowSplash(true);
              }}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-[8px] hover:border-slate-300 transition-colors shadow-xs"
              title="Replay opening launch animation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E05D38]" />
              <span>Replay Intro</span>
            </button>

            {/* Download APK / Project Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsApkModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-[#E6F5F0] border border-emerald-300/80 rounded-[8px] hover:bg-[#D5EFE6] transition-colors shadow-xs"
              title="Get Android APK or Studio Project"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Get APK</span>
            </button>

            {/* Mobile / Fullscreen view toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsMobileFrame(!isMobileFrame);
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-[8px] hover:border-slate-300 transition-colors shadow-xs"
              title="Toggle Android Device Frame view"
            >
              {isMobileFrame ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Full Width
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#E05D38]" />
                  Pixel 9 Frame
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <SoftButton
              variant="primary"
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </SoftButton>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Device Wrapper (Pixel 9 Pro Frame mode vs Standard layout) */}
        <div
          className={`transition-all duration-300 mx-auto ${
            isMobileFrame
              ? 'max-w-[430px] bg-[#FAF7F2] p-4 rounded-[36px] shadow-2xl border-[8px] border-slate-800'
              : 'w-full'
          }`}
        >
          {/* Mobile Status Bar Simulation (when in mobile frame) */}
          {isMobileFrame && (
            <div className="flex items-center justify-between px-4 pb-3 pt-1 text-[11px] font-semibold text-slate-700 border-b border-amber-900/10 mb-3">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <span className="w-4 h-2.5 border border-slate-700 rounded-[3px] inline-block relative after:content-[''] after:absolute after:inset-0.5 after:bg-slate-700" />
              </div>
            </div>
          )}

          {/* Navigation Tabs for Mobile / Compact views */}
          <div className="flex md:hidden items-center p-1 bg-white rounded-[10px] border border-slate-200 mb-4 shadow-xs">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('tasks');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-colors ${
                activeTab === 'tasks' ? 'bg-[#2C3E50] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Actions
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('dashboard');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-colors ${
                activeTab === 'dashboard' ? 'bg-[#2C3E50] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('code');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-colors ${
                activeTab === 'code' ? 'bg-[#2C3E50] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Kotlin Code
            </button>
          </div>

          {/* VIEW TAB 1: ACTION ITEMS (TASK LIST & FILTERS) */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search actions, internships, or deliverables..."
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/90 rounded-[10px] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05D38] focus:border-transparent transition-all soft-shadow-card"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Urgent Filter Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setUrgentOnly(!urgentOnly);
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-[10px] border transition-all flex items-center justify-center gap-1.5 shrink-0 select-none ${
                    urgentOnly
                      ? 'bg-[#FFEBE5] border-[#E05D38] text-[#E05D38] soft-shadow-card'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 soft-shadow-card'
                  }`}
                >
                  <Flame
                    className={`w-3.5 h-3.5 ${
                      urgentOnly ? 'text-[#E05D38]' : 'text-slate-400'
                    }`}
                  />
                  <span>Urgent Only (&lt;48h)</span>
                  {urgentCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        urgentOnly ? 'bg-[#E05D38] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {urgentCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Interactive Category Filter Tabs (Functional segmented buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-[10px] whitespace-nowrap shrink-0 transition-all border ${
                    selectedCategory === null
                      ? 'bg-[#2C3E50] text-white border-[#2C3E50] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  All Actions ({tasks.length})
                </button>

                {(Object.keys(CATEGORIES) as TaskCategoryType[]).map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const isSelected = selectedCategory === catKey;
                  const count = tasks.filter((t) => t.category === catKey).length;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategory(catKey);
                      }}
                      style={{
                        backgroundColor: isSelected ? cat.accentColor : '#FFFFFF',
                        borderColor: isSelected ? cat.accentColor : '#E2E8F0',
                        color: isSelected ? '#FFFFFF' : '#334155',
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-[10px] whitespace-nowrap shrink-0 transition-all border shadow-xs flex items-center gap-1.5`}
                    >
                      <span>{cat.displayName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Task Items List with Staggered Entrance Animations */}
              <div className="space-y-2.5 pt-1">
                {filteredTasks.length === 0 ? (
                  <SoftCard className="p-12 text-center bg-white border border-slate-200/70">
                    <div className="w-12 h-12 rounded-[12px] bg-[#FAF7F2] text-[#E05D38] flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      No matching action items
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {searchQuery || urgentOnly || selectedCategory
                        ? 'Try loosening your search filters to see all managed items.'
                        : 'Your action pipeline is completely clear. Add your first goal to unleash TatKraft!'}
                    </p>
                    <div className="mt-4">
                      <SoftButton
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchQuery('');
                          setUrgentOnly(false);
                          setIsTaskModalOpen(true);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create First Action
                      </SoftButton>
                    </div>
                  </SoftCard>
                ) : (
                  <AnimatePresence>
                    {filteredTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(index * 0.04, 0.3),
                          ease: 'easeOut',
                        }}
                      >
                        <TaskCard
                          task={task}
                          onToggleCompletion={handleToggleTask}
                          onEdit={(t) => {
                            setTaskToEdit(t);
                            setIsTaskModalOpen(true);
                          }}
                          onDelete={handleDeleteTask}
                          onInspectReminders={(t) => setInspectingReminderTask(t)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}

          {/* VIEW TAB 2: PROGRESS DASHBOARD & ANALYTICS */}
          {activeTab === 'dashboard' && (
            <ProgressDashboard
              tasks={tasks}
              onSelectCategoryFilter={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('tasks');
              }}
              onFilterUrgent={() => {
                setUrgentOnly(true);
                setActiveTab('tasks');
              }}
            />
          )}

          {/* VIEW TAB 3: KOTLIN JETPACK COMPOSE SOURCE INSPECTOR */}
          {activeTab === 'code' && <KotlinCodeViewer />}
        </div>
      </main>

      {/* Task Creation / Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* Proactive Reminder Inspector Modal */}
      <ReminderModal
        task={inspectingReminderTask}
        onClose={() => setInspectingReminderTask(null)}
        onTriggerTestAlert={handleTriggerTestAlert}
      />

      {/* APK & Source Code Download Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Buttery-Smooth Opening Launch Animation */}
      <SplashOpeningAnimation
        isOpen={showSplash}
        onFinish={() => setShowSplash(false)}
      />
    </div>
  );
}
