import { Typography } from "@mui/material";


export default function SectionHeading({ label }) {
    return <Typography sx={{
        display: 'flex', alignItems: 'center', fontSize: { xs: 14, md: 16, lg: 16 }, fontWeight: 500,
        color: 'primary.main', justifyContent: 'center', p: { xs: 1, md: 1 }, bgcolor: '#E6F1FF',
        border: '1px solid #1414171A', textTransform: 'uppercase', mb: 1.5
    }}>
        {label}
    </Typography>
}