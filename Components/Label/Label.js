import { Box, Typography } from "@mui/material";

export default function Label({ label, type = 'normal', postFix, color, iconRight, containerStyle = {}, iconLeft, style = {} }) {
    //The types are: heading1, heading2,heading3,heading4,heading5,normal, small, tiny
    const typeStyle = {
        heading1: {
            fontSize: 20, fontWeight: 700
        },
        heading2: {
            fontSize: 18, fontWeight: 700
        },
        heading3: {
            fontSize: 16, fontWeight: 700
        },
        heading4: {
            fontSize: 14, fontWeight: 700
        },
        heading5: {
            fontSize: 12, fontWeight: 700
        },
        normal: {
            fontSize: 16, fontWeight: 500
        },
        small: {
            fontSize: 14, fontWeight: 400
        },
        tiny: {
            fontSize: 12, fontWeight: 400
        },
    };

    return <Box sx={{ color, display: 'flex', alignItems: 'center', ...containerStyle }}>
        {iconLeft}
        <Typography sx={{ ...(typeStyle[type] ?? {}), ...style, display: 'flex', alignItems: 'center' }} >
            {label} {postFix}
        </Typography>
        {iconRight}
    </Box>
}