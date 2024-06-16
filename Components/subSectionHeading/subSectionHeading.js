import { Box, Typography } from "@mui/material";


export default function SubSectionHeading({ label, optional, endComponentArray }) {
    return <Box sx={{
        display: 'flex', alignItems: 'center',
        color: '#282828', justifyContent: 'flex-start', p: { xs: 1, md: 1 }, bgcolor: '#E8E8E8',
        border: '1px solid #1414171A', textTransform: 'capitalize', mb: 1.5
    }}>
        <Typography sx={{ fontSize: { xs: 14, md: 14, lg: 13 }, fontWeight: 600, }}>
            {label}
        </Typography>

        {optional && <Typography sx={{ color: 'primary.main', fontSize: 11, ml: 2 }}>
            Optional
        </Typography>}

        <Box sx={{ flexGrow: 1 }} />

        {endComponentArray && <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {endComponentArray?.map(i => i)}
        </Box>}
    </Box>
}