package com.tatkraft.app.ui.screens

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tatkraft.app.ui.components.FluidProgressBar
import com.tatkraft.app.ui.theme.IndigoMuted
import com.tatkraft.app.ui.theme.IndigoText
import com.tatkraft.app.ui.theme.SoftCreamBackground
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.TatKraftCyan
import com.tatkraft.app.ui.theme.TatKraftOrange
import com.tatkraft.app.ui.theme.softUiElevation
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Delightful, buttery-smooth opening launch animation for TatKraft.
 * Features a spring physics logo bounce, particle glow, and progress bar charging sequence.
 */
@Composable
fun SplashScreen(
    onAnimationComplete: () -> Unit
) {
    val scale = remember { Animatable(0f) }
    val rotation = remember { Animatable(-15f) }
    val textAlpha = remember { Animatable(0f) }
    val textOffsetY = remember { Animatable(25f) }
    val progress = remember { Animatable(0f) }
    val exitAlpha = remember { Animatable(1f) }

    LaunchedEffect(Unit) {
        // Phase 1: Spring pop-up for the TatKraft chevron mark
        launch {
            scale.animateTo(
                targetValue = 1f,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioMediumBouncy,
                    stiffness = Spring.StiffnessLow
                )
            )
        }
        launch {
            rotation.animateTo(
                targetValue = 0f,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioLowBouncy,
                    stiffness = Spring.StiffnessLow
                )
            )
        }

        delay(250)

        // Phase 2: Staggered text reveal with slide up
        launch {
            textAlpha.animateTo(1f, animationSpec = tween(400, easing = FastOutSlowInEasing))
        }
        launch {
            textOffsetY.animateTo(0f, animationSpec = spring(dampingRatio = Spring.DampingRatioNoBouncy))
        }

        // Phase 3: Calibrating momentum progress
        progress.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 900, easing = FastOutSlowInEasing)
        )

        delay(200)

        // Phase 4: Smooth exit dissolve
        exitAlpha.animateTo(0f, animationSpec = tween(300, easing = FastOutSlowInEasing))
        onAnimationComplete()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SoftCreamBackground)
            .alpha(exitAlpha.value),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Soft UI Tactile Squircle with Animated Dual Chevron Logo
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .scale(scale.value)
                    .softUiElevation(
                        cornerRadius = 24.dp,
                        elevation = 8.dp,
                        darkShadowColor = Color(0x18E05D38),
                        lightHighlightColor = Color.White
                    )
                    .clip(RoundedCornerShape(24.dp))
                    .background(SoftCreamCard),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.size(68.dp)) {
                    val w = size.width
                    val h = size.height

                    // Upper energetic coral arrow
                    val topArrowPath = Path().apply {
                        moveTo(w * 0.15f, h * 0.65f)
                        lineTo(w * 0.42f, h * 0.38f)
                        lineTo(w * 0.54f, h * 0.52f)
                        lineTo(w * 0.78f, h * 0.22f)
                        lineTo(w * 0.72f, h * 0.45f)
                        lineTo(w * 0.88f, h * 0.16f)
                        lineTo(w * 0.58f, h * 0.24f)
                        lineTo(w * 0.66f, h * 0.32f)
                        lineTo(w * 0.48f, h * 0.58f)
                        lineTo(w * 0.36f, h * 0.44f)
                        close()
                    }
                    drawPath(
                        path = topArrowPath,
                        brush = Brush.linearGradient(
                            colors = listOf(TatKraftOrange, Color(0xFFFF7A59)),
                            start = Offset(0f, 0f),
                            end = Offset(w, h)
                        )
                    )

                    // Lower cyan momentum bolt
                    val bottomBoltPath = Path().apply {
                        moveTo(w * 0.18f, h * 0.72f)
                        lineTo(w * 0.34f, h * 0.54f)
                        lineTo(w * 0.46f, h * 0.68f)
                        lineTo(w * 0.72f, h * 0.42f)
                        lineTo(w * 0.58f, h * 0.82f)
                        lineTo(w * 0.42f, h * 0.64f)
                        lineTo(w * 0.30f, h * 0.80f)
                        close()
                    }
                    drawPath(
                        path = bottomBoltPath,
                        brush = Brush.linearGradient(
                            colors = listOf(TatKraftCyan, Color(0xFF38BDF8)),
                            start = Offset(0f, 0f),
                            end = Offset(w, h)
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Brand Typography
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .alpha(textAlpha.value)
            ) {
                Text(
                    text = "TatKraft",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = IndigoText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Action-Driven Momentum Engine",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = IndigoMuted,
                    letterSpacing = 0.5.sp
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Progress Loader Bar
                Box(modifier = Modifier.size(width = 160.dp, height = 6.dp)) {
                    FluidProgressBar(
                        progress = progress.value,
                        height = 6.dp,
                        gradientColors = listOf(TatKraftOrange, TatKraftCyan)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Overcoming friction...",
                    fontSize = 11.sp,
                    color = IndigoMuted
                )
            }
        }
    }
}
