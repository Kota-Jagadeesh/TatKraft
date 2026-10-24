package com.tatkraft.app.reminder

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.tatkraft.app.MainActivity
import com.tatkraft.app.R

/**
 * Proactive background notification worker triggered by WorkManager
 * according to task-specific reminder frequency (e.g., 3x daily starting 3 days prior).
 */
class ReminderWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val taskId = inputData.getString(KEY_TASK_ID) ?: return Result.failure()
        val taskTitle = inputData.getString(KEY_TASK_TITLE) ?: "Upcoming Deadline"
        val categoryName = inputData.getString(KEY_CATEGORY_NAME) ?: "Action Item"
        val daysRemaining = inputData.getInt(KEY_DAYS_REMAINING, 1)

        sendNotification(taskId, taskTitle, categoryName, daysRemaining)
        return Result.success()
    }

    private fun sendNotification(
        taskId: String,
        taskTitle: String,
        categoryName: String,
        daysRemaining: Int
    ) {
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val channelId = CHANNEL_ID_REMINDERS
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "TatKraft Proactive Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Tactile alerts to overcome procrastination before deadlines"
                enableVibration(true)
                setShowBadge(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("EXTRA_TASK_ID", taskId)
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            taskId.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val urgencyText = when {
            daysRemaining <= 0 -> "Deadline is TODAY! Take action now."
            daysRemaining == 1 -> "Tomorrow is the deadline! Stay in flow."
            else -> "$daysRemaining days left. TatKraft mode: take initiative today!"
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("⚡ TatKraft: $taskTitle")
            .setContentText("[$categoryName] $urgencyText")
            .setStyle(NotificationCompat.BigTextStyle().bigText("[$categoryName] $urgencyText Focus for 25 minutes to make meaningful headway."))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(taskId.hashCode(), notification)
    }

    companion object {
        const val CHANNEL_ID_REMINDERS = "tatkraft_reminders_channel"
        const val KEY_TASK_ID = "task_id"
        const val KEY_TASK_TITLE = "task_title"
        const val KEY_CATEGORY_NAME = "category_name"
        const val KEY_DAYS_REMAINING = "days_remaining"
    }
}
