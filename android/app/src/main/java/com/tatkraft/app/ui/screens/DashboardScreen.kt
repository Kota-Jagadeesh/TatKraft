package com.tatkraft.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tatkraft.app.data.model.TaskCategory
import com.tatkraft.app.ui.components.FluidProgressBar
import com.tatkraft.app.ui.components.FluidProgressRing
import com.tatkraft.app.ui.components.SoftCard
import com.tatkraft.app.ui.theme.IndigoMuted
import com.tatkraft.app.ui.theme.IndigoPrimary
import com.tatkraft.app.ui.theme.IndigoText
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.TatKraftCyan
import com.tatkraft.app.ui.theme.TatKraftMint
import com.tatkraft.app.ui.theme.TatKraftOrange
import com.tatkraft.app.ui.theme.TatKraftPeach
import com.tatkraft.app.viewmodel.TaskViewModel

@Composable
fun DashboardScreen(
    viewModel: TaskViewModel,
    modifier: Modifier = Modifier
) {
    val analytics by viewModel.analytics.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(SoftCreamBackground)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "TatKraft Analytics",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = IndigoText
        )
        Text(
            text = "Action momentum & deadline readiness",
            fontSize = 13.sp,
            color = IndigoMuted
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Hero Metric Card with Circular Arc
        SoftCard(
            modifier = Modifier.fillMaxWidth(),
            cornerRadius = 12.dp,
            backgroundColor = SoftCreamCard,
            elevation = 4.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "COMPLETION RATE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = IndigoMuted
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${analytics.completedCount} of ${analytics.totalTasks} Done",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = IndigoText
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = when {
                            analytics.completionPercentage >= 75f -> "Outstanding energy! You are conquering your backlog."
                            analytics.completionPercentage >= 40f -> "Great momentum. Keep knocking out key deliverables."
                            else -> "TatKraft reminder: Start with a 15-minute quick win today."
                        },
                        fontSize = 12.sp,
                        color = IndigoMuted,
                        lineHeight = 16.sp
                    )
                }

                FluidProgressRing(
                    progress = if (analytics.totalTasks > 0) analytics.completionPercentage / 100f else 0f,
                    size = 92.dp,
                    strokeWidth = 9.dp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 3 Key Tactical Metric Cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Completed Card
            SoftCard(
                modifier = Modifier.weight(1f),
                cornerRadius = 12.dp,
                backgroundColor = SoftCreamCard
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "Completed",
                        fontSize = 12.sp,
                        color = IndigoMuted
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${analytics.completedCount}",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = TatKraftMint
                    )
                }
            }

            // Pending Card
            SoftCard(
                modifier = Modifier.weight(1f),
                cornerRadius = 12.dp,
                backgroundColor = SoftCreamCard
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "In Progress",
                        fontSize = 12.sp,
                        color = IndigoMuted
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${analytics.pendingCount}",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = TatKraftCyan
                    )
                }
            }

            // Urgent Card (<48h)
            SoftCard(
                modifier = Modifier.weight(1f),
                cornerRadius = 12.dp,
                backgroundColor = SoftCreamCard
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "Urgent (<48h)",
                        fontSize = 12.sp,
                        color = IndigoMuted
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${analytics.urgentCount}",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (analytics.urgentCount > 0) TatKraftOrange else IndigoText
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Linear Progress Bar Summary
        SoftCard(
            modifier = Modifier.fillMaxWidth(),
            cornerRadius = 12.dp,
            backgroundColor = SoftCreamCard
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Overall Flow Progress",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = IndigoText
                    )
                    Text(
                        text = "${analytics.completionPercentage.toInt()}%",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = TatKraftOrange
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
                FluidProgressBar(
                    progress = if (analytics.totalTasks > 0) analytics.completionPercentage / 100f else 0f,
                    height = 10.dp
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Category Breakdown
        Text(
            text = "Action Items by Category",
            fontSize = 16.sp,
            fontWeight = FontWeight.SemiBold,
            color = IndigoText
        )
        Spacer(modifier = Modifier.height(10.dp))

        analytics.categoryCounts.forEach { (cat, count) ->
            val percentage = if (analytics.totalTasks > 0) (count.toFloat() / analytics.totalTasks.toFloat()) else 0f
            SoftCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                cornerRadius = 10.dp,
                backgroundColor = SoftCreamCard
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = cat.displayName,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = IndigoText
                        )
                        Text(
                            text = "$count tasks",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = cat.getAccentColor()
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    FluidProgressBar(
                        progress = percentage,
                        height = 6.dp,
                        gradientColors = listOf(cat.getAccentColor(), cat.getAccentColor().copy(alpha = 0.6f))
                    )
                }
            }
        }
    }
}
