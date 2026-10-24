package com.tatkraft.app.data.model

import androidx.compose.ui.graphics.Color

enum class TaskCategory(
    val displayName: String,
    val iconName: String,
    val accentHex: Long,
    val surfaceHex: Long
) {
    INTERNSHIPS("Internships", "Briefcase", 0xFFE05D38, 0xFFFFECE6),
    PROJECTS("Projects", "Rocket", 0xFF0284C7, 0xFFE0F2FE),
    APPLICATIONS("Applications", "Send", 0xFF2D7D63, 0xFFE6F5F0),
    STUDIES("Studies", "BookOpen", 0xFF7C3AED, 0xFFF3E8FF),
    WORK("Work", "Terminal", 0xFFD97706, 0xFFFEF3C7),
    PERSONAL("Personal", "Heart", 0xFFDB2777, 0xFFFCE7F3);

    fun getAccentColor(): Color = Color(accentHex)
    fun getSurfaceColor(): Color = Color(surfaceHex)
}
