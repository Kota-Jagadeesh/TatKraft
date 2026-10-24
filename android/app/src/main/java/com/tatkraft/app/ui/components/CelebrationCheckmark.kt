package com.tatkraft.app.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tatkraft.app.ui.theme.IndigoHairline
import com.tatkraft.app.ui.theme.TatKraftMint
import kotlin.math.cos
import kotlin.math.sin

/**
 * Satisfying checkmark morphing animation with spring scale overshoot
 * and radial particle burst when completed.
 */
@Composable
fun CelebrationCheckmark(
    isChecked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = 28.dp,
    checkedColor: Color = TatKraftMint,
    uncheckedColor: Color = IndigoHairline
) {
    val scale = remember { Animatable(1f) }
    val pathProgress = remember { Animatable(if (isChecked) 1f else 0f) }
    val particleRadius = remember { Animatable(0f) }
    val particleAlpha = remember { Animatable(0f) }

    LaunchedEffect(isChecked) {
        if (isChecked) {
            // Trigger bouncy scale pop
            scale.animateTo(
                targetValue = 1.25f,
                animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow)
            )
            scale.animateTo(1f, animationSpec = spring(dampingRatio = Spring.DampingRatioNoBouncy))
            // Draw checkmark path
            pathProgress.animateTo(1f, animationSpec = tween(durationMillis = 280, easing = FastOutSlowInEasing))
            // Particle burst
            particleRadius.snapTo(0f)
            particleAlpha.snapTo(1f)
            particleRadius.animateTo(36f, animationSpec = tween(350, easing = FastOutSlowInEasing))
            particleAlpha.animateTo(0f, animationSpec = tween(150))
        } else {
            scale.animateTo(0.9f, animationSpec = tween(100))
            scale.animateTo(1f, animationSpec = spring())
            pathProgress.animateTo(0f, animationSpec = tween(150))
        }
    }

    val animatedBorderColor by animateColorAsState(
        targetValue = if (isChecked) checkedColor else uncheckedColor,
        animationSpec = tween(200),
        label = "borderColor"
    )

    Box(
        modifier = modifier
            .size(size)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                onCheckedChange(!isChecked)
            },
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val center = Offset(this.size.width / 2f, this.size.height / 2f)
            val baseRadius = (this.size.minDimension / 2f) - 2.dp.toPx()

            // Outer Soft Border Circle / Fill
            if (isChecked) {
                drawCircle(
                    color = checkedColor,
                    radius = baseRadius * scale.value,
                    center = center
                )
            } else {
                drawCircle(
                    color = Color.White,
                    radius = baseRadius,
                    center = center
                )
                drawCircle(
                    color = animatedBorderColor,
                    radius = baseRadius,
                    center = center,
                    style = Stroke(width = 2.dp.toPx())
                )
            }

            // Morphing Checkmark Path
            if (pathProgress.value > 0.01f) {
                val checkPath = Path().apply {
                    moveTo(this@Canvas.size.width * 0.28f, this@Canvas.size.height * 0.52f)
                    lineTo(this@Canvas.size.width * 0.44f, this@Canvas.size.height * 0.68f)
                    lineTo(this@Canvas.size.width * 0.72f, this@Canvas.size.height * 0.36f)
                }

                val pathMeasure = PathMeasure().apply {
                    setPath(checkPath, false)
                }
                val totalLength = pathMeasure.length
                val drawLength = totalLength * pathProgress.value

                val subPath = Path()
                pathMeasure.getSegment(0f, drawLength, subPath, true)

                drawPath(
                    path = subPath,
                    color = Color.White,
                    style = Stroke(
                        width = 2.5.dp.toPx(),
                        cap = StrokeCap.Round,
                        join = StrokeJoin.Round
                    )
                )
            }

            // Radial Particle Sparks
            if (particleAlpha.value > 0.01f) {
                val particleCount = 8
                val angleStep = (2 * Math.PI) / particleCount
                for (i in 0 until particleCount) {
                    val angle = i * angleStep
                    val pX = center.x + (baseRadius + particleRadius.value) * cos(angle).toFloat()
                    val pY = center.y + (baseRadius + particleRadius.value) * sin(angle).toFloat()

                    drawCircle(
                        color = checkedColor.copy(alpha = particleAlpha.value),
                        radius = 2.5.dp.toPx() * (1f - (particleRadius.value / 36f)),
                        center = Offset(pX, pY)
                    )
                }
            }
        }
    }
}
