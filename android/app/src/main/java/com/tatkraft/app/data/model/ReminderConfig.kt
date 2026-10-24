package com.tatkraft.app.data.model

import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

/**
 * Advanced custom reminder configuration for TatKraft.
 * Allows users to set proactive reminders that start N days prior to deadline
 * with customizable daily frequencies (e.g., 1x, 2x, 3x per day).
 */
data class ReminderConfig(
    val isEnabled: Boolean = true,
    val daysBefore: Int = 3, // e.g. Start 3 days before deadline
    val frequencyPerDay: Int = 3, // e.g. 3 times a day
    val preferredTimesOfDay: List<String> = listOf("09:00", "13:30", "18:00") // Time slots
) {
    /**
     * Calculates the timestamp when proactive reminders should start.
     */
    fun calculateStartDate(deadline: LocalDateTime): LocalDateTime {
        return deadline.minusDays(daysBefore.toLong())
    }

    /**
     * Determines whether the reminder period is currently active based on current time.
     */
    fun isPeriodActive(deadline: LocalDateTime, now: LocalDateTime = LocalDateTime.now()): Boolean {
        if (!isEnabled) return false
        val start = calculateStartDate(deadline)
        return now.isAfter(start) && now.isBefore(deadline)
    }

    /**
     * Computes the human-readable summary string (e.g. "Starts 3d before · 3x daily").
     */
    fun getSummaryText(): String {
        if (!isEnabled) return "Reminders Off"
        val dayText = when (daysBefore) {
            0 -> "On deadline day"
            1 -> "Starts 1 day prior"
            else -> "Starts $daysBefore days prior"
        }
        val freqText = when (frequencyPerDay) {
            1 -> "1x daily"
            2 -> "2x daily"
            3 -> "3x daily"
            else -> "${frequencyPerDay}x daily"
        }
        return "$dayText · $freqText"
    }
}
