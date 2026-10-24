package com.tatkraft.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tatkraft.app.ui.theme.TatKraftOrange
import com.tatkraft.app.ui.theme.softUiElevation
import com.tatkraft.app.ui.theme.springPress

@Composable
fun SoftButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 10.dp,
    containerColor: Color = TatKraftOrange,
    contentColor: Color = Color.White,
    leadingIcon: (@Composable () -> Unit)? = null,
    paddingValues: PaddingValues = PaddingValues(horizontal = 16.dp, vertical = 10.dp)
) {
    val shape = RoundedCornerShape(cornerRadius)

    Box(
        modifier = modifier
            .softUiElevation(
                cornerRadius = cornerRadius,
                elevation = 3.dp,
                darkShadowColor = containerColor.copy(alpha = 0.25f),
                lightHighlightColor = Color(0x66FFFFFF)
            )
            .clip(shape)
            .background(containerColor)
            .border(1.dp, Color(0x1AFFFFFF), shape)
            .springPress(onClick = onClick)
            .padding(paddingValues),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (leadingIcon != null) {
                leadingIcon()
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                color = contentColor,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
