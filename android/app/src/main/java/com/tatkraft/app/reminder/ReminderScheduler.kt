package com.tatkraft.app.reminder

import android.content.Context
import androidx.work.Data
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.tatkraft.app.data.model.Task
import java.util.concurrent.TimeUnit

class ReminderScheduler(private val context: Context) {

    private val workManager = WorkManager.getInstance(context)

    /**
     * Schedules multi-interval proactive reminders for a task based on its custom ReminderConfig.
     * e.g. Starting 3 days prior, with 3 notifications daily.
     */
    fun scheduleRemindersForTask(task: Task) {
        cancelRemindersForTask(task.id)

        if (task.isCompleted || !task.reminderConfig.isEnabled) {
            return
        }

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
                    .addTag("task_${task.id}")
                    .build()

                workManager.enqueueUniqueWork(
                    "reminder_${task.id}_slot_$slotIndex",
                    ExistingWorkPolicy.REPLACE,
                    workRequest
                )
            }
        }
    }

    fun cancelRemindersForTask(taskId: String) {
        workManager.cancelAllWorkByTag("task_$taskId")
    }
}
