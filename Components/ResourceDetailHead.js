import { Box, Typography, useTheme } from "@mui/material";
import PrevIcon from '@mui/icons-material/KeyboardArrowLeft';
import TabHead from "./TabHead";

export default function ResourceDetailHead({ title, goBack }) {
    const darkMode = useTheme().palette.mode === 'dark';

    return <Box>
        <TabHead />
        <Typography sx={{
            fontSize: { xs: 16, md: 20 }, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center',
            textTransform: 'capitalize', maxWidth: '100%',
            backgroundColor: darkMode ? '#1A222C' : 'secondary.main', px: { xs: 2, md: 3 }, py: 1
        }}>
            <PrevIcon onClick={goBack} sx={{
                ":hover": { color: 'text.secondary' },
                marginRight: 1, fontSize: { xs: 26, md: 36 }, cursor: 'pointer'
            }} />
            {title}
        </Typography>
    </Box>
}