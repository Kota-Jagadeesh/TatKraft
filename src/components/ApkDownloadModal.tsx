import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Smartphone,
  CheckCircle,
  Copy,
  Terminal,
  ExternalLink,
  X,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SoftButton } from './SoftButton';
import { SoftCard } from './SoftCard';
import { sound } from '../utils/sound';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const buildCommand = './gradlew assembleDebug';

  const handleCopyCmd = () => {
    sound.playClick();
    navigator.clipboard.writeText(buildCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="w-full max-w-lg bg-[#FCFAF7] rounded-[16px] p-6 soft-shadow-card border border-amber-900/10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#E05D38] to-[#0284C7] flex items-center justify-center text-white shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Android APK & Studio Package
                </h3>
                <p className="text-xs text-slate-500">
                  TatKraft v1.0.0 (API Level 35 · Jetpack Compose)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* Primary Download Card */}
            <div className="p-4 bg-white rounded-[12px] border border-slate-200/80 soft-shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">
                    TatKraft-Android-Project.zip
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-semibold">
                    Complete Codebase
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Turnkey Android Studio project with Room Database, WorkManager, and Soft UI animations.
                </p>
              </div>

              <a
                href="/download/TatKraft-Android-Project.zip"
                download="TatKraft-Android-Project.zip"
                onClick={() => sound.playCelebrationChime()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E05D38] hover:bg-[#D04E29] text-white font-semibold text-xs rounded-[10px] soft-shadow-btn transition-transform active:scale-95 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download ZIP</span>
              </a>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                How to Build & Run on Your Android Device
              </h4>

              {/* Step 1 */}
              <div className="flex items-start gap-3 text-xs bg-white p-3 rounded-[10px] border border-slate-200/60">
                <span className="w-5 h-5 rounded-full bg-[#FAF7F2] text-[#E05D38] font-bold flex items-center justify-center shrink-0 border border-amber-900/10">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Open in Android Studio
                  </span>
                  <span className="text-slate-500">
                    Unzip and choose <strong>File &gt; Open...</strong> in Android Studio (Ladybug 2024.2+). Gradle will sync all dependencies automatically.
                  </span>
                </div>
              </div>

              {/* Step 2: One-line build command */}
              <div className="flex items-start gap-3 text-xs bg-white p-3 rounded-[10px] border border-slate-200/60">
                <span className="w-5 h-5 rounded-full bg-[#FAF7F2] text-[#0284C7] font-bold flex items-center justify-center shrink-0 border border-amber-900/10">
                  2
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 block">
                    Generate the APK via Terminal
                  </span>
                  <span className="text-slate-500 block mb-1.5">
                    Run this command in the project root to generate the debug APK:
                  </span>
                  <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-3 py-1.5 rounded-[8px] font-mono text-[11px]">
                    <code>{buildCommand}</code>
                    <button
                      type="button"
                      onClick={handleCopyCmd}
                      className="ml-2 text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedCmd ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 text-xs bg-white p-3 rounded-[10px] border border-slate-200/60">
                <span className="w-5 h-5 rounded-full bg-[#FAF7F2] text-emerald-600 font-bold flex items-center justify-center shrink-0 border border-amber-900/10">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Install & Enjoy
                  </span>
                  <span className="text-slate-500">
                    The compiled file is at <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">app/build/outputs/apk/debug/app-debug.apk</code>. Run <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">adb install app-debug.apk</code> or transfer directly to your Android device!
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Mobile PWA Install Alternative */}
            <div className="p-3 bg-[#E6F5F0] rounded-[10px] border border-emerald-300/40 text-xs text-[#1E5845]">
              <span className="font-bold block mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Instant Mobile Web Install Option
              </span>
              <span>
                You can also open this live URL in Google Chrome on your Android phone and select <strong>"Add to Home screen"</strong> to install TatKraft as an Android standalone app immediately!
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-end">
            <SoftButton variant="dark" size="sm" onClick={onClose}>
              Done
            </SoftButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
