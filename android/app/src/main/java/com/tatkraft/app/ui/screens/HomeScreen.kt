package com.tatkraft.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tatkraft.app.data.model.Task
import com.tatkraft.app.data.model.TaskCategory
import com.tatkraft.app.ui.components.CelebrationCheckmark
import com.tatkraft.app.ui.components.SoftCard
import com.tatkraft.app.ui.theme.IndigoHairline
import com.tatkraft.app.ui.theme.IndigoMuted
import com.tatkraft.app.ui.theme.IndigoPrimary
import com.tatkraft.app.ui.theme.IndigoText
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.TatKraftOrange
import com.tatkraft.app.ui.theme.TatKraftPeach
import com.tatkraft.app.ui.theme.softUiElevation
import com.tatkraft.app.viewmodel.TaskViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HomeScreen(
    viewModel: TaskViewModel,
    modifier: Modifier = Modifier
) {
    val tasks by viewModel.filteredTasks.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val isUrgentOnly by viewModel.filterUrgentOnly.collectAsState()

    var taskToEdit by remember { mutableStateOf<Task?>(null) }
    var showCreateDialog by remember { mutableStateOf(false) }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = SoftCreamBackground,
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCreateDialog = true },
                containerColor = TatKraftOrange,
                contentColor = Color.White,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.softUiElevation(12.dp, 6.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Task")
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            // App Brand Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "TatKraft",
                        fontSize = 26.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = IndigoText
                    )
                    Text(
                        text = "Turn Intention into Momentum",
                        fontSize = 13.sp,
                        color = IndigoMuted
                    )
                }

                // Urgent Filter Toggle Button
                val urgentShape = RoundedCornerShape(10.dp)
                Box(
                    modifier = Modifier
                        .clip(urgentShape)
                        .background(if (isUrgentOnly) TatKraftPeach else SoftCreamCard)
                        .border(
                            1.dp,
                            if (isUrgentOnly) TatKraftOrange else IndigoHairline,
                            urgentShape
                        )
                        .clickable { viewModel.toggleUrgentFilter() }
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = if (isUrgentOnly) "⚡ Urgent Active" else "Urgent Only",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (isUrgentOnly) TatKraftOrange else IndigoPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                placeholder = { Text("Search actions, internships, projects...", fontSize = 13.sp) },
                leadingIcon = {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = null,
                        tint = IndigoMuted,
                        modifier = Modifier.size(18.dp)
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(10.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = TatKraftOrange,
                    unfocusedBorderColor = IndigoHairline,
                    focusedContainerColor = SoftCreamCard,
                    unfocusedContainerColor = SoftCreamCard
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Category Filter Pills / Tabs
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    val isAllSelected = selectedCategory == null
                    val shape = RoundedCornerShape(10.dp)
                    Box(
                        modifier = Modifier
                            .clip(shape)
                            .background(if (isAllSelected) IndigoPrimary else SoftCreamCard)
                            .border(1.dp, if (isAllSelected) IndigoPrimary else IndigoHairline, shape)
                            .clickable { viewModel.setCategoryFilter(null) }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Text(
                            text = "All Tasks",
                            fontSize = 12.sp,
                            fontWeight = if (isAllSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isAllSelected) Color.White else IndigoText
                        )
                    }
                }

                items(TaskCategory.values()) { category ->
                    val isSelected = selectedCategory == category
                    val shape = RoundedCornerShape(10.dp)
                    Box(
                        modifier = Modifier
                            .clip(shape)
                            .background(if (isSelected) category.getAccentColor() else SoftCreamCard)
                            .border(
                                1.dp,
                                if (isSelected) category.getAccentColor() else IndigoHairline,
                                shape
                            )
                            .clickable { viewModel.setCategoryFilter(category) }
                            .padding(horizontal = 12.dp, vertical = 7.dp)
                    ) {
                        Text(
                            text = category.displayName,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) Color.White else IndigoText
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Task List with Staggered Entrance Animations
            if (tasks.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "No action items found",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = IndigoText
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Add a task to start building TatKraft momentum!",
                            fontSize = 13.sp,
                            color = IndigoMuted
                        )
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    itemsIndexed(
                        items = tasks,
                        key = { _, item -> item.id }
                    ) { index, task ->
                        AnimatedVisibility(
                            visible = true,
                            enter = fadeIn(animationSpec = tween(durationMillis = 300, delayMillis = index * 40)) +
                                    slideInVertically(
                                        animationSpec = tween(300, delayMillis = index * 40),
                                        initialOffsetY = { 60 }
                                    )
                        ) {
                            TaskItemCard(
                                task = task,
                                onToggleCompletion = { viewModel.toggleTaskCompletion(task) },
                                onClick = { taskToEdit = task }
                            )
                        }
                    }
                    item {
                        Spacer(modifier = Modifier.height(72.dp))
                    }
                }
            }
        }
    }

    // Task Creation Dialog
    if (showCreateDialog) {
        TaskDetailDialog(
            initialTask = null,
            onDismiss = { showCreateDialog = false },
            onSaveTask = { newTask -> viewModel.saveTask(newTask) }
        )
    }

    // Task Editing Dialog
    taskToEdit?.let { task ->
        TaskDetailDialog(
            initialTask = task,
            onDismiss = { taskToEdit = null },
            onSaveTask = { updated -> viewModel.saveTask(updated) },
            onDeleteTask = { toDelete -> viewModel.deleteTask(toDelete) }
        )
    }
}

@Composable
fun TaskItemCard(
    task: Task,
    onToggleCompletion: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dateFmt = SimpleDateFormat("MMM d, h:mm a", Locale.getDefault())

    SoftCard(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        cornerRadius = 12.dp,
        backgroundColor = if (task.isCompleted) SoftCreamCard.copy(alpha = 0.7f) else SoftCreamCard,
        elevation = if (task.isCompleted) 1.dp else 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Morphing Celebration Checkmark
            CelebrationCheckmark(
                isChecked = task.isCompleted,
                onCheckedChange = { onToggleCompletion() },
                size = 28.dp
            )

            Spacer(modifier = Modifier.width(14.dp))

            // Task Content
            Column(modifier = Modifier.weight(1f)) {
                // Category & Deadline Pill Row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = task.category.displayName,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = task.category.getAccentColor()
                    )
                    Text(
                        text = "·",
                        fontSize = 11.sp,
                        color = IndigoMuted
                    )
                    Text(
                        text = dateFmt.format(Date(task.deadlineEpochMillis)),
                        fontSize = 11.sp,
                        color = if (task.isUrgent) TatKraftOrange else IndigoMuted,
                        fontWeight = if (task.isUrgent) FontWeight.SemiBold else FontWeight.Normal
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))

                // Title
                Text(
                    text = task.title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = if (task.isCompleted) IndigoMuted else IndigoText,
                    textDecoration = if (task.isCompleted) TextDecoration.LineThrough else null
                )

                if (task.description.isNotBlank()) {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = task.description,
                        fontSize = 12.sp,
                        color = IndigoMuted,
                        maxLines = 1
                    )
                }

                // Proactive Reminder Indicator
                if (task.reminderConfig.isEnabled && !task.isCompleted) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.NotificationsActive,
                            contentDescription = null,
                            tint = TatKraftOrange,
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = task.reminderConfig.getSummaryText(),
                            fontSize = 10.sp,
                            color = TatKraftOrange
                        )
                    }
                }
            }
        }
    }
}
