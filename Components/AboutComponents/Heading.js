import { Box, Typography } from "@mui/material";

export default function Heading({ icon, title, color, uppercase }) {
    return <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color, my: 2, position: 'relative', zIndex: 2
    }}>
        {icon}
        <Typography sx={{
            fontSize: { xs: 16, md: 20 }, mx: 2, fontWeight: 600,
            textTransform: uppercase ? 'uppercase' : 'inherit'
        }}>
            {title}
        </Typography>
        {icon}
    </Box>
}