package com.tatkraft.app.data.model

import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.UUID

@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String = "",
    val category: TaskCategory,
    val deadlineEpochMillis: Long,
    val isCompleted: Boolean = false,
    val completedAtEpochMillis: Long? = null,
    val createdAtEpochMillis: Long = System.currentTimeMillis(),
    val priority: Priority = Priority.HIGH,
    @Embedded(prefix = "reminder_")
    val reminderConfig: ReminderConfig = ReminderConfig()
) {
    val deadlineDateTime: LocalDateTime
        get() = Instant.ofEpochMilli(deadlineEpochMillis)
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime()

    val isOverdue: Boolean
        get() = !isCompleted && System.currentTimeMillis() > deadlineEpochMillis

    val hoursUntilDeadline: Long
        get() {
            val now = System.currentTimeMillis()
            return if (deadlineEpochMillis > now) {
                (deadlineEpochMillis - now) / (1000 * 60 * 60)
            } else 0
        }

    val isUrgent: Boolean
        get() = !isCompleted && hoursUntilDeadline in 0..48

    enum class Priority {
        CRITICAL, HIGH, NORMAL, LOW
    }
}
