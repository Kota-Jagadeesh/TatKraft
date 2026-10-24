package com.tatkraft.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tatkraft.app.ui.theme.SoftCreamCard
import com.tatkraft.app.ui.theme.softUiElevation

/**
 * Tactile Soft UI Card with multi-layer ambient shadow,
 * 10-12dp corner radius, and subtle border highlight.
 */
@Composable
fun SoftCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 12.dp,
    backgroundColor: Color = SoftCreamCard,
    borderColor: Color = Color(0x0D000000),
    elevation: Dp = 4.dp,
    content: @Composable BoxScope.() -> Unit
) {
    val shape = RoundedCornerShape(cornerRadius)

    Box(
        modifier = modifier
            .softUiElevation(
                cornerRadius = cornerRadius,
                elevation = elevation,
                darkShadowColor = Color(0x142C3E50),
                lightHighlightColor = Color(0xEEFFFFFF)
            )
            .clip(shape)
            .background(backgroundColor)
            .border(width = 1.dp, color = borderColor, shape = shape),
        content = content
    )
}
