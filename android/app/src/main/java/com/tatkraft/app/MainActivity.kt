package com.tatkraft.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.FormatListBulleted
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tatkraft.app.ui.screens.DashboardScreen
import com.tatkraft.app.ui.screens.HomeScreen
import com.tatkraft.app.ui.screens.SplashScreen
import com.tatkraft.app.ui.theme.IndigoHairline
import com.tatkraft.app.ui.theme.IndigoMuted
import com.tatkraft.app.ui.theme.IndigoText
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.TatKraftOrange
import com.tatkraft.app.ui.theme.TatKraftTheme
import com.tatkraft.app.ui.theme.softUiElevation
import com.tatkraft.app.viewmodel.TaskViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: TaskViewModel by viewModels {
        val app = application as TatKraftApplication
        TaskViewModel.Factory(app.repository, app.reminderScheduler)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TatKraftTheme {
                MainAppScaffold(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MainAppScaffold(viewModel: TaskViewModel) {
    var isSplashVisible by remember { mutableStateOf(true) }
    var selectedTab by remember { mutableIntStateOf(0) }

    if (isSplashVisible) {
        SplashScreen(onAnimationComplete = { isSplashVisible = false })
    } else {
        Scaffold(
            containerColor = SoftCreamBackground,
            bottomBar = {
                SoftBottomNavigationBar(
                    selectedTab = selectedTab,
                    onTabSelected = { selectedTab = it }
                )
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                Crossfade(targetState = selectedTab, label = "tabTransition") { tab ->
                    when (tab) {
                        0 -> HomeScreen(viewModel = viewModel)
                        1 -> DashboardScreen(viewModel = viewModel)
                    }
                }
            }
        }
    }
}

@Composable
fun SoftBottomNavigationBar(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .softUiElevation(
                cornerRadius = 0.dp,
                elevation = 6.dp,
                darkShadowColor = Color(0x122C3E50),
                lightHighlightColor = Color(0xCCFFFFFF)
            )
            .background(SoftCreamCard)
            .height(64.dp)
            .padding(horizontal = 24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            BottomNavItem(
                icon = Icons.Default.FormatListBulleted,
                label = "Actions",
                isSelected = selectedTab == 0,
                onClick = { onTabSelected(0) }
            )

            BottomNavItem(
                icon = Icons.Default.PieChart,
                label = "Dashboard",
                isSelected = selectedTab == 1,
                onClick = { onTabSelected(1) }
            )
        }
    }
}

@Composable
fun BottomNavItem(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val shape = RoundedCornerShape(10.dp)
    Box(
        modifier = Modifier
            .clip(shape)
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isSelected) TatKraftOrange else IndigoMuted,
                modifier = Modifier.size(22.dp)
            )
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) TatKraftOrange else IndigoMuted
            )
        }
    }
}
