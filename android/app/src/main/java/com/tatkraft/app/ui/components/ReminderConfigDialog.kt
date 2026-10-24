package com.tatkraft.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.tatkraft.app.data.model.ReminderConfig
import com.tatkraft.app.ui.theme.IndigoMuted
import com.tatkraft.app.ui.theme.IndigoPrimary
import com.tatkraft.app.ui.theme.IndigoText
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.TatKraftOrange

@Composable
fun ReminderConfigDialog(
    initialConfig: ReminderConfig,
    onDismiss: () -> Unit,
    onSave: (ReminderConfig) -> Unit
) {
    var isEnabled by remember { mutableStateOf(initialConfig.isEnabled) }
    var daysBefore by remember { mutableIntStateOf(initialConfig.daysBefore) }
    var frequency by remember { mutableIntStateOf(initialConfig.frequencyPerDay) }

    Dialog(onDismissRequest = onDismiss) {
        SoftCard(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            cornerRadius = 12.dp,
            backgroundColor = SoftCreamCard
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Proactive Reminders",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = IndigoText
                        )
                        Text(
                            text = "Stay ahead before deadline pressure hits",
                            fontSize = 12.sp,
                            color = IndigoMuted
                        )
                    }
                    Switch(
                        checked = isEnabled,
                        onCheckedChange = { isEnabled = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = TatKraftOrange
                        )
                    )
                }

                if (isEnabled) {
                    Spacer(modifier = Modifier.height(18.dp))

                    Text(
                        text = "START REMINDERS BEFORE DEADLINE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = IndigoMuted
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(1, 2, 3, 5, 7).forEach { days ->
                            val isSelected = daysBefore == days
                            val shape = RoundedCornerShape(10.dp)
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(shape)
                                    .background(if (isSelected) TatKraftOrange else SoftCreamBackground)
                                    .border(1.dp, if (isSelected) TatKraftOrange else Color(0x14000000), shape)
                                    .clickable { daysBefore = days }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "${days}d",
                                    fontSize = 13.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) Color.White else IndigoText
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    Text(
                        text = "DAILY NOTIFICATION FREQUENCY",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = IndigoMuted
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(
                            1 to "1x / day",
                            2 to "2x / day",
                            3 to "3x / day"
                        ).forEach { (freq, label) ->
                            val isSelected = frequency == freq
                            val shape = RoundedCornerShape(10.dp)
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(shape)
                                    .background(if (isSelected) IndigoPrimary else SoftCreamBackground)
                                    .border(1.dp, if (isSelected) IndigoPrimary else Color(0x14000000), shape)
                                    .clickable { frequency = freq }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = label,
                                    fontSize = 12.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) Color.White else IndigoText
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Calculated: Alerts start $daysBefore days before deadline, sent $frequency times throughout each day.",
                        fontSize = 12.sp,
                        color = IndigoMuted
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    SoftButton(
                        text = "Save Configuration",
                        onClick = {
                            onSave(
                                ReminderConfig(
                                    isEnabled = isEnabled,
                                    daysBefore = daysBefore,
                                    frequencyPerDay = frequency
                                )
                            )
                            onDismiss()
                        }
                    )
                }
            }
        }
    }
}
