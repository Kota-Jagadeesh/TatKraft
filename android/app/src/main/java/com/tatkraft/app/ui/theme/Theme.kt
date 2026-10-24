package com.tatkraft.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = TatKraftOrange,
    onPrimary = SoftCreamSurface,
    primaryContainer = TatKraftPeach,
    onPrimaryContainer = IndigoPrimary,
    secondary = TatKraftCyan,
    onSecondary = SoftCreamSurface,
    background = SoftCreamBackground,
    onBackground = IndigoText,
    surface = SoftCreamSurface,
    onSurface = IndigoText,
    surfaceVariant = SoftCreamCard,
    onSurfaceVariant = IndigoMuted
)

@Composable
fun TatKraftTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = SoftCreamBackground.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = true
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
