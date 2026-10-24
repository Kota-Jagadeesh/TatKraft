import React, { useState } from 'react';
import { Copy, Check, FileCode, Layers, ShieldCheck, Download } from 'lucide-react';
import { SoftCard } from './SoftCard';
import { SoftButton } from './SoftButton';

interface CodeFile {
  path: string;
  filename: string;
  language: string;
  category: 'UI' | 'ViewModel' | 'Data' | 'Reminder' | 'Config';
  code: string;
}

const KOTLIN_FILES: CodeFile[] = [
  {
    filename: 'CelebrationCheckmark.kt',
    path: 'ui/components/CelebrationCheckmark.kt',
    category: 'UI',
    language: 'kotlin',
    code: `package com.tatkraft.app.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tatkraft.app.ui.theme.TatKraftMint
import kotlin.math.cos
import kotlin.math.sin

/**
 * Satisfying checkmark morphing animation with spring scale overshoot
 * and radial particle burst when completed.
 */
@Composable
fun CelebrationCheckmark(
    isChecked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = 28.dp,
    checkedColor: Color = TatKraftMint
) {
    val scale = remember { Animatable(1f) }
    val pathProgress = remember { Animatable(if (isChecked) 1f else 0f) }
    val particleRadius = remember { Animatable(0f) }
    val particleAlpha = remember { Animatable(0f) }

    LaunchedEffect(isChecked) {
        if (isChecked) {
            scale.animateTo(1.25f, spring(dampingRatio = Spring.DampingRatioMediumBouncy))
            scale.animateTo(1f, spring(dampingRatio = Spring.DampingRatioNoBouncy))
            pathProgress.animateTo(1f, tween(280, easing = FastOutSlowInEasing))
            particleRadius.snapTo(0f); particleAlpha.snapTo(1f)
            particleRadius.animateTo(36f, tween(350, easing = FastOutSlowInEasing))
            particleAlpha.animateTo(0f, tween(150))
        } else {
            scale.animateTo(0.9f, tween(100))
            scale.animateTo(1f, spring())
            pathProgress.animateTo(0f, tween(150))
        }
    }

    Box(
        modifier = modifier.size(size).clickable { onCheckedChange(!isChecked) },
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val center = Offset(this.size.width / 2f, this.size.height / 2f)
            val baseRadius = (this.size.minDimension / 2f) - 2.dp.toPx()

            if (isChecked) {
                drawCircle(color = checkedColor, radius = baseRadius * scale.value, center = center)
            } else {
                drawCircle(color = Color.White, radius = baseRadius, center = center)
                drawCircle(color = Color(0xFFE2E8F0), radius = baseRadius, center = center, style = Stroke(2.dp.toPx()))
            }

            if (pathProgress.value > 0.01f) {
                val checkPath = Path().apply {
                    moveTo(this@Canvas.size.width * 0.28f, this@Canvas.size.height * 0.52f)
                    lineTo(this@Canvas.size.width * 0.44f, this@Canvas.size.height * 0.68f)
                    lineTo(this@Canvas.size.width * 0.72f, this@Canvas.size.height * 0.36f)
                }
                val pathMeasure = PathMeasure().apply { setPath(checkPath, false) }
                val subPath = Path()
                pathMeasure.getSegment(0f, pathMeasure.length * pathProgress.value, subPath, true)
                drawPath(subPath, Color.White, style = Stroke(2.5.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round))
            }
        }
    }
}`,
  },
  {
    filename: 'SoftUiModifiers.kt',
    path: 'ui/theme/SoftUiModifiers.kt',
    category: 'UI',
    language: 'kotlin',
    code: `package com.tatkraft.app.ui.theme

import android.graphics.BlurMaskFilter
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

fun Modifier.softUiElevation(
    cornerRadius: Dp = 12.dp,
    elevation: Dp = 4.dp,
    darkShadowColor: Color = Color(0x183C404B),
    lightHighlightColor: Color = Color(0xCCFFFFFF)
): Modifier = this.drawBehind {
    val cornerRadiusPx = cornerRadius.toPx()
    val elevationPx = elevation.toPx()

    drawIntoCanvas { canvas ->
        val paint = Paint()
        val frameworkPaint = paint.asFrameworkPaint()

        // Ambient Dark Shadow
        frameworkPaint.color = darkShadowColor.toArgb()
        frameworkPaint.maskFilter = BlurMaskFilter(elevationPx * 2f, BlurMaskFilter.Blur.NORMAL)
        canvas.nativeCanvas.drawRoundRect(
            elevationPx, elevationPx, size.width + elevationPx, size.height + elevationPx,
            cornerRadiusPx, cornerRadiusPx, frameworkPaint
        )

        // Top-Left Soft Highlight
        frameworkPaint.color = lightHighlightColor.toArgb()
        frameworkPaint.maskFilter = BlurMaskFilter(elevationPx, BlurMaskFilter.Blur.NORMAL)
        canvas.nativeCanvas.drawRoundRect(
            -elevationPx * 0.5f, -elevationPx * 0.5f, size.width - elevationPx * 0.5f, size.height - elevationPx * 0.5f,
            cornerRadiusPx, cornerRadiusPx, frameworkPaint
        )
    }
}

fun Modifier.springPress(
    targetScale: Float = 0.96f,
    onClick: (() -> Unit)? = null
): Modifier = composed {
    val scale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()

    this.scale(scale.value).pointerInput(Unit) {
        while (true) {
            awaitPointerEventScope {
                awaitFirstDown(false)
                scope.launch {
                    scale.animateTo(targetScale, spring(Spring.DampingRatioMediumBouncy))
                }
                val up = waitForUpOrCancellation()
                scope.launch {
                    scale.animateTo(1f, spring(Spring.DampingRatioMediumBouncy))
                }
                if (up != null && onClick != null) onClick()
            }
        }
    }
}`,
  },
  {
    filename: 'ReminderScheduler.kt',
    path: 'reminder/ReminderScheduler.kt',
    category: 'Reminder',
    language: 'kotlin',
    code: `package com.tatkraft.app.reminder

import android.content.Context
import androidx.work.Data
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.tatkraft.app.data.model.Task
import java.util.concurrent.TimeUnit

class ReminderScheduler(private val context: Context) {
    private val workManager = WorkManager.getInstance(context)

    fun scheduleRemindersForTask(task: Task) {
        cancelRemindersForTask(task.id)
        if (task.isCompleted || !task.reminderConfig.isEnabled) return

        val now = System.currentTimeMillis()
        val deadline = task.deadlineEpochMillis
        if (deadline <= now) return

        val daysPriorMillis = TimeUnit.DAYS.toMillis(task.reminderConfig.daysBefore.toLong())
        val reminderStartEpoch = deadline - daysPriorMillis
        val effectiveStartEpoch = if (now > reminderStartEpoch) now else reminderStartEpoch
        val totalIntervalMillis = deadline - effectiveStartEpoch
        if (totalIntervalMillis <= 0) return

        val frequencyPerDay = task.reminderConfig.frequencyPerDay.coerceAtLeast(1)
        val estimatedTotalDays = ((deadline - now) / TimeUnit.DAYS.toMillis(1)).toInt().coerceAtLeast(1)
        val totalReminderSlots = (estimatedTotalDays * frequencyPerDay).coerceIn(1, 12)
        val stepMillis = totalIntervalMillis / (totalReminderSlots + 1)

        for (slotIndex in 1..totalReminderSlots) {
            val triggerEpoch = effectiveStartEpoch + (slotIndex * stepMillis)
            val delayMillis = triggerEpoch - now

            if (delayMillis > 0) {
                val daysRemaining = ((deadline - triggerEpoch) / TimeUnit.DAYS.toMillis(1)).toInt()
                val inputData = Data.Builder()
                    .putString(ReminderWorker.KEY_TASK_ID, task.id)
                    .putString(ReminderWorker.KEY_TASK_TITLE, task.title)
                    .putString(ReminderWorker.KEY_CATEGORY_NAME, task.category.displayName)
                    .putInt(ReminderWorker.KEY_DAYS_REMAINING, daysRemaining)
                    .build()

                val workRequest = OneTimeWorkRequestBuilder<ReminderWorker>()
                    .setInitialDelay(delayMillis, TimeUnit.MILLISECONDS)
                    .setInputData(inputData)
                    .addTag("task_\${task.id}")
                    .build()

                workManager.enqueueUniqueWork(
                    "reminder_\${task.id}_slot_\$slotIndex",
                    ExistingWorkPolicy.REPLACE,
                    workRequest
                )
            }
        }
    }

    fun cancelRemindersForTask(taskId: String) {
        workManager.cancelAllWorkByTag("task_\$taskId")
    }
}`,
  },
  {
    filename: 'TaskViewModel.kt',
    path: 'viewmodel/TaskViewModel.kt',
    category: 'ViewModel',
    language: 'kotlin',
    code: `package com.tatkraft.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tatkraft.app.data.model.Task
import com.tatkraft.app.data.model.TaskCategory
import com.tatkraft.app.data.repository.TaskRepository
import com.tatkraft.app.reminder.ReminderScheduler
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class TaskViewModel(
    private val repository: TaskRepository,
    private val reminderScheduler: ReminderScheduler
) : ViewModel() {

    private val _selectedCategory = MutableStateFlow<TaskCategory?>(null)
    val selectedCategory: StateFlow<TaskCategory?> = _selectedCategory

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    private val _filterUrgentOnly = MutableStateFlow(false)
    val filterUrgentOnly: StateFlow<Boolean> = _filterUrgentOnly

    val allTasks: StateFlow<List<Task>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val filteredTasks: StateFlow<List<Task>> = combine(
        allTasks, _selectedCategory, _searchQuery, _filterUrgentOnly
    ) { tasks, category, query, urgentOnly ->
        tasks.filter { task ->
            val matchesCategory = category == null || task.category == category
            val matchesQuery = query.isBlank() || task.title.contains(query, true)
            val matchesUrgent = !urgentOnly || task.isUrgent
            matchesCategory && matchesQuery && matchesUrgent
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleTaskCompletion(task: Task) {
        viewModelScope.launch {
            val willBeCompleted = !task.isCompleted
            repository.toggleTaskCompletion(task.id, task.isCompleted)
            if (willBeCompleted) {
                reminderScheduler.cancelRemindersForTask(task.id)
            } else {
                reminderScheduler.scheduleRemindersForTask(task.copy(isCompleted = false))
            }
        }
    }
}`,
  },
  {
    filename: 'MainActivity.kt',
    path: 'MainActivity.kt',
    category: 'UI',
    language: 'kotlin',
    code: `package com.tatkraft.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FormatListBulleted
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.tatkraft.app.ui.screens.DashboardScreen
import com.tatkraft.app.ui.screens.HomeScreen
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.TatKraftTheme
import com.tatkraft.app.viewmodel.TaskViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: TaskViewModel by viewModels {
        val app = application as TatKraftApplication
        TaskViewModel.Factory(app.repository, app.reminderScheduler)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TatKraftTheme {
                var selectedTab by remember { mutableIntStateOf(0) }
                Scaffold(
                    containerColor = SoftCreamBackground,
                    bottomBar = {
                        SoftBottomNavigationBar(selectedTab) { selectedTab = it }
                    }
                ) { padding ->
                    Box(modifier = Modifier.padding(padding)) {
                        Crossfade(targetState = selectedTab) { tab ->
                            if (tab == 0) HomeScreen(viewModel) else DashboardScreen(viewModel)
                        }
                    }
                }
            }
        }
    }
}`,
  },
  {
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    category: 'Config',
    language: 'kotlin',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.tatkraft.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.tatkraft.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
    buildFeatures { compose = true }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.work.runtime.ktx)
}`,
  },
];

export const KotlinCodeViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = KOTLIN_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <SoftCard className="p-5 bg-white border border-slate-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#2C3E50] text-white flex items-center justify-center font-mono font-bold text-sm">
              KT
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Native Android Kotlin & Compose Source Code
              </h2>
              <p className="text-xs text-slate-500">
                Production-ready Jetpack Compose MVVM codebase generated in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/android</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/download/TatKraft-Android-Project.zip"
              download="TatKraft-Android-Project.zip"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[10px] bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 soft-shadow-card transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#E05D38]" />
              Download Full Android Project (.zip)
            </a>
            <SoftButton size="sm" variant="dark" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy File'}
            </SoftButton>
          </div>
        </div>
      </SoftCard>

      {/* Code Inspector Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File List Navigation */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
            Android Project Files
          </div>
          {KOTLIN_FILES.map((file, idx) => {
            const isSelected = activeFileIndex === idx;
            return (
              <button
                key={file.filename}
                type="button"
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-[10px] text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#2C3E50] text-white font-semibold shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{file.filename}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-[6px] shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {file.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-[#1E293B] rounded-[12px] border border-slate-800 shadow-xl overflow-hidden">
            {/* Code Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <span className="text-slate-500">com.tatkraft.app/</span>
                <span className="text-amber-400">{activeFile.path}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 max-h-[540px] overflow-auto">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                <code>{activeFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
