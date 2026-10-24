package com.tatkraft.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.tatkraft.app.data.model.Priority
import com.tatkraft.app.data.model.ReminderConfig
import com.tatkraft.app.data.model.Task
import com.tatkraft.app.data.model.TaskCategory
import com.tatkraft.app.ui.components.ReminderConfigDialog
import com.tatkraft.app.ui.components.SoftButton
import com.tatkraft.app.ui.components.SoftCard
import com.tatkraft.app.ui.theme.IndigoHairline
import com.tatkraft.app.ui.theme.IndigoMuted
import com.tatkraft.app.ui.theme.IndigoPrimary
import com.tatkraft.app.ui.theme.IndigoText
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.TatKraftOrange
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

@Composable
fun TaskDetailDialog(
    initialTask: Task?,
    onDismiss: () -> Unit,
    onSaveTask: (Task) -> Unit,
    onDeleteTask: ((Task) -> Unit)? = null
) {
    var title by remember { mutableStateOf(initialTask?.title ?: "") }
    var description by remember { mutableStateOf(initialTask?.description ?: "") }
    var category by remember { mutableStateOf(initialTask?.category ?: TaskCategory.INTERNSHIPS) }
    var deadlineEpoch by remember {
        mutableLongStateOf(
            initialTask?.deadlineEpochMillis ?: (System.currentTimeMillis() + TimeUnit.DAYS.toMillis(3))
        )
    }
    var reminderConfig by remember {
        mutableStateOf(initialTask?.reminderConfig ?: ReminderConfig())
    }
    var showReminderSettings by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        SoftCard(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            cornerRadius = 12.dp,
            backgroundColor = SoftCreamCard
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = if (initialTask == null) "New TatKraft Action" else "Edit Action Item",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = IndigoText
                )
                Text(
                    text = "Initiate action and conquer procrastination",
                    fontSize = 12.sp,
                    color = IndigoMuted
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Title Input
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Task Title *", fontSize = 13.sp) },
                    placeholder = { Text("e.g. Google Internship Application") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TatKraftOrange,
                        unfocusedBorderColor = IndigoHairline,
                        focusedLabelColor = TatKraftOrange
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Description Input
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description & Milestone Notes", fontSize = 13.sp) },
                    placeholder = { Text("Add key requirements, bullet points, or deliverables...") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3,
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TatKraftOrange,
                        unfocusedBorderColor = IndigoHairline
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Category Selection
                Text(
                    text = "CATEGORY",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = IndigoMuted
                )
                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TaskCategory.values().take(3).forEach { cat ->
                        val isSelected = category == cat
                        val shape = RoundedCornerShape(10.dp)
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(shape)
                                .background(if (isSelected) cat.getSurfaceColor() else SoftCreamBackground)
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) cat.getAccentColor() else IndigoHairline,
                                    shape = shape
                                )
                                .clickable { category = cat }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = cat.displayName,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) cat.getAccentColor() else IndigoText
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TaskCategory.values().drop(3).take(3).forEach { cat ->
                        val isSelected = category == cat
                        val shape = RoundedCornerShape(10.dp)
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(shape)
                                .background(if (isSelected) cat.getSurfaceColor() else SoftCreamBackground)
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) cat.getAccentColor() else IndigoHairline,
                                    shape = shape
                                )
                                .clickable { category = cat }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = cat.displayName,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) cat.getAccentColor() else IndigoText
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Deadline Quick Presets
                val dateFmt = SimpleDateFormat("EEE, MMM d, yyyy", Locale.getDefault())
                Text(
                    text = "DEADLINE: ${dateFmt.format(Date(deadlineEpoch))}",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = IndigoMuted
                )
                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf(
                        1 to "Tomorrow",
                        3 to "In 3 Days",
                        7 to "In 1 Week"
                    ).forEach { (days, label) ->
                        val target = System.currentTimeMillis() + TimeUnit.DAYS.toMillis(days.toLong())
                        val shape = RoundedCornerShape(10.dp)
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(shape)
                                .background(SoftCreamBackground)
                                .border(1.dp, IndigoHairline, shape)
                                .clickable { deadlineEpoch = target }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = label,
                                fontSize = 11.sp,
                                color = IndigoText
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Custom Reminder Settings Row
                val shape10 = RoundedCornerShape(10.dp)
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(shape10)
                        .background(SoftCreamBackground)
                        .border(1.dp, IndigoHairline, shape10)
                        .clickable { showReminderSettings = true }
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Proactive Reminders",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = IndigoText
                            )
                            Text(
                                text = reminderConfig.getSummaryText(),
                                fontSize = 11.sp,
                                color = TatKraftOrange
                            )
                        }
                        Text(
                            text = "Configure",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = IndigoPrimary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (initialTask != null && onDeleteTask != null) {
                        Text(
                            text = "Delete",
                            color = Color(0xFFDC2626),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.clickable {
                                onDeleteTask(initialTask)
                                onDismiss()
                            }
                        )
                    } else {
                        Text(
                            text = "Cancel",
                            color = IndigoMuted,
                            fontSize = 13.sp,
                            modifier = Modifier.clickable { onDismiss() }
                        )
                    }

                    SoftButton(
                        text = if (initialTask == null) "Create Task" else "Save Changes",
                        onClick = {
                            if (title.isNotBlank()) {
                                val taskToSave = initialTask?.copy(
                                    title = title.trim(),
                                    description = description.trim(),
                                    category = category,
                                    deadlineEpochMillis = deadlineEpoch,
                                    reminderConfig = reminderConfig
                                ) ?: Task(
                                    title = title.trim(),
                                    description = description.trim(),
                                    category = category,
                                    deadlineEpochMillis = deadlineEpoch,
                                    reminderConfig = reminderConfig
                                )
                                onSaveTask(taskToSave)
                                onDismiss()
                            }
                        }
                    )
                }
            }
        }
    }

    if (showReminderSettings) {
        ReminderConfigDialog(
            initialConfig = reminderConfig,
            onDismiss = { showReminderSettings = false },
            onSave = { updated -> reminderConfig = updated }
        )
    }
}
