package com.tatkraft.app.ui.theme

import android.graphics.BlurMaskFilter
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/**
 * Custom Multi-layer Soft UI Box Shadow Modifier for Jetpack Compose.
 * Creates an extruded, tactile soft-ui surface with ambient dark shadow on bottom-right
 * and a crisp soft highlight on top-left.
 */
fun Modifier.softUiElevation(
    cornerRadius: Dp = 12.dp,
    elevation: Dp = 4.dp,
    darkShadowColor: Color = Color(0x183C404B),
    lightHighlightColor: Color = Color(0xCCFFFFFF)
): Modifier = this.drawBehind {
    val cornerRadiusPx = cornerRadius.toPx()
    val elevationPx = elevation.toPx()

    drawIntoCanvas { canvas ->
        val paint = Paint()
        val frameworkPaint = paint.asFrameworkPaint()

        // Bottom-Right Dark Diffused Shadow
        frameworkPaint.color = darkShadowColor.toArgb()
        frameworkPaint.maskFilter = BlurMaskFilter(elevationPx * 2f, BlurMaskFilter.Blur.NORMAL)
        canvas.nativeCanvas.drawRoundRect(
            elevationPx,
            elevationPx,
            size.width + elevationPx,
            size.height + elevationPx,
            cornerRadiusPx,
            cornerRadiusPx,
            frameworkPaint
        )

        // Top-Left Soft Light Rim
        frameworkPaint.color = lightHighlightColor.toArgb()
        frameworkPaint.maskFilter = BlurMaskFilter(elevationPx, BlurMaskFilter.Blur.NORMAL)
        canvas.nativeCanvas.drawRoundRect(
            -elevationPx * 0.5f,
            -elevationPx * 0.5f,
            size.width - elevationPx * 0.5f,
            size.height - elevationPx * 0.5f,
            cornerRadiusPx,
            cornerRadiusPx,
            frameworkPaint
        )
    }
}

/**
 * Spring-physics tactile press scale effect for interactive buttons and cards.
 * Scales down to 0.96 on press and springs back on release using Compose spring physics.
 */
fun Modifier.springPress(
    targetScale: Float = 0.96f,
    onClick: (() -> Unit)? = null
): Modifier = composed {
    val scale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()

    this
        .scale(scale.value)
        .pointerInput(Unit) {
            while (true) {
                awaitPointerEventScope {
                    awaitFirstDown(false)
                    scope.launch {
                        scale.animateTo(
                            targetValue = targetScale,
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioMediumBouncy,
                                stiffness = Spring.StiffnessLow
                            )
                        )
                    }
                    val up = waitForUpOrCancellation()
                    scope.launch {
                        scale.animateTo(
                            targetValue = 1f,
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioMediumBouncy,
                                stiffness = Spring.StiffnessMedium
                            )
                        )
                    }
                    if (up != null && onClick != null) {
                        onClick()
                    }
                }
            }
        }
}
