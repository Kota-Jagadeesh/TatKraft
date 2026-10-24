# TatKraft (⚡ Action-Driven Task & Habit Engine)

> **TatKraft** (German: *action-driven energy, initiative, and overcoming procrastination*) is a production-ready native Android application built with **Kotlin** and **Jetpack Compose**, implementing a clean **MVVM architecture** with a tactile **Soft UI Evolution** design language and physics-based celebration animations.

---

## 📱 App Highlights & Brand Identity

- **Brand Concept**: Procrastination is defeated by breaking friction into immediate, tactile micro-actions. TatKraft provides momentum through visual rewards, proactive reminder scheduling, and tactile haptic feedback.
- **Aesthetic**: **Soft UI Evolution** — high-contrast pastel backgrounds (warm creams `#FAF7F2`, soft muted indigos `#2C3E50`, fresh mint `#2D7D63`, peach `#FFE8E1`, and energetic logo coral `#E05D38` & sky cyan `#0284C7`).
- **Tactile Depth**: Custom multi-layer soft shadows (`Modifier.softUiElevation`) simulating extruded surfaces with ambient bottom-right diffused shadows and crisp top-left rim lighting.
- **Micro-Interactions**: Spring physics-based scale animations, checkmark morphing vector path animations, and radial particle/confetti bursts upon task completion.

---

## 🏛 Clean Architecture (MVVM Overview)

TatKraft strictly adheres to Android architecture guidelines:

```
android/app/src/main/java/com/tatkraft/app/
│
├── TatKraftApplication.kt          // Application singleton (Room DB, Scope, WorkManager)
├── MainActivity.kt                 // Main Compose entry point & Soft Bottom Navigation
│
├── data/
│   ├── model/
│   │   ├── Task.kt                 // Room Entity with urgency & deadline calculation
│   │   ├── ReminderConfig.kt       // Proactive scheduling configuration
│   │   └── TaskCategory.kt         // Internships, Projects, Applications, etc.
│   ├── local/
│   │   ├── TaskDao.kt              // Reactive Coroutines Flow queries & CRUD operations
│   │   └── TatKraftDatabase.kt     // Room Database with pre-populated seed tasks
│   └── repository/
│       └── TaskRepository.kt       // Clean repository abstracting database from ViewModel
│
├── reminder/
│   ├── ReminderWorker.kt           // CoroutineWorker issuing high-priority notifications
│   └── ReminderScheduler.kt       // WorkManager scheduler computing multi-interval alert slots
│
├── viewmodel/
│   └── TaskViewModel.kt            // StateFlow pipelines for tasks, analytics & UI events
│
└── ui/
    ├── theme/
    │   ├── Color.kt                // Warm cream, muted indigo & pastel accent tokens
    │   ├── Theme.kt                // Material 3 theme integration
    │   └── SoftUiModifiers.kt      // Custom Canvas soft box shadow & spring press modifiers
    ├── components/
    │   ├── SoftCard.kt             // Tactile extruded card with 12dp rounding
    │   ├── SoftButton.kt           // Tactile button with spring physics
    │   ├── CelebrationCheckmark.kt // Morphing path animation & radial particle burst
    │   ├── AnimatedProgressBar.kt  // Fluid animated linear bar & circular arc ring
    │   └── ReminderConfigDialog.kt // Task-specific proactive reminder configuration
    └── screens/
        ├── HomeScreen.kt           // Task list with staggered animations, filter & search
        ├── DashboardScreen.kt      // Completion rate ring, urgent stats & category charts
        └── TaskDetailDialog.kt     // Task CRUD modal with deadline presets & reminder settings
```

---

## ⏰ Advanced Proactive Reminder Engine

Traditional task apps only notify when a deadline is already due. TatKraft reverses this with **Proactive Interval Scheduling**:

1. **Configurable Start Window**: Configure alerts to begin $N$ days prior to deadline (e.g., 3 days before).
2. **Frequency Distribution**: Set daily frequency (e.g., 1x, 2x, 3x per day).
3. **Android WorkManager & Exact Alarms**:
   - `ReminderScheduler` calculates the exact time window between start time and deadline.
   - Enqueues unique `OneTimeWorkRequest`s for each slot with `ExistingWorkPolicy.REPLACE`.
   - `ReminderWorker` delivers high-priority Android notifications with actionable urgency copy.
   - When a task is marked completed, all scheduled reminder slots are cancelled immediately via `cancelAllWorkByTag`.

---

## 🎨 Soft UI Evolution & Animation System

- **Corner Radius**: Strictly constrained to **8–12dp** component rounding for cards, buttons, and dialogs.
- **Multi-Layer Canvas Shadows**: Created via `drawIntoCanvas` with `BlurMaskFilter` applying dual light highlights and ambient dark shadows.
- **Spring Physics**: Implemented with `Animatable` and `spring(dampingRatio = Spring.DampingRatioMediumBouncy)`.
- **Celebration Checkmark**:
  - Uses `PathMeasure.getSegment()` to progressively draw the checkmark stroke.
  - Generates 8 trigonometric radial particle sparks around the perimeter.

---

## 🚀 Setup & Build Instructions

1. **Prerequisites**:
   - Android Studio Ladybug (2024.2+) or newer.
   - JDK 17 or JDK 21.
   - Android SDK 35 (compileSdk 35, minSdk 26).

2. **Clone and Open**:
   - Open the `/android` directory in Android Studio.
   - Android Studio will synchronize with `libs.versions.toml`.

3. **Run**:
   - Select an Android Virtual Device (API 34 or 35 recommended) or physical device.
   - Click **Run 'app'** (`Shift + F10`).
