import { Avatar, Box, Typography } from "@mui/material";

export default function DataItem({ flex, label, value, capitalize, image, fullWidth = true, color = '#282828', iconLeft, iconRight }) {
    return <Box sx={{
        display: 'flex', flexDirection: flex ? 'row' : 'column', alignItems: flex ? 'center' : 'flex-start',
        width: fullWidth ? '100%' : 'max-content', py: .5, border: '1px solid #1414171A', borderRadius: '8px',
        bgcolor: '#F5F5F5', mb: 1.5, mr: 2
    }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 500, mb: .5, mx: 1.5, fontSize: 14 }}>
            {label}{flex ? ':' : ''}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: flex ? 0 : 1.5, mr: 1.5 }}>
            {iconLeft}
            {image && <Avatar src={image} sx={{ height: 25, width: 25, mr: 1 }} />}
            {(typeof value === 'string')
                ? <Typography sx={{ fontSize: 13, fontWeight: 500, color }}
                    dangerouslySetInnerHTML={{ __html: value }}>
                </Typography>
                : <Typography sx={{ fontSize: 13, fontWeight: 500, color }} >
                    {value}
                </Typography>}
            {iconRight}
        </Box>
    </Box>
}