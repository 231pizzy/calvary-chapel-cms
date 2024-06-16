import { ChildrenSvgDyn, MenSvgDyn, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import { Box, Button, Typography } from "@mui/material";

export default function MinistryTabHead({ currentTabId }) {

    const iconStyle = { width: '20px', height: '20px', }
    const tabs = [
        { label: "Men's Ministry", id: 'men-service', url: '/admin/ministry/men-ministry', icon: <MenSvgDyn style={iconStyle} /> },
        { label: "Women's Ministry", id: 'women-service', url: '/admin/ministry/women-ministry', icon: <WomenSvgDyn style={iconStyle} /> },
        { label: "Youth Ministry", id: 'youth-service', url: '/admin/ministry/youth-ministry', icon: <YouthSvgDyn style={iconStyle} /> },
        { label: "Children's Ministry", id: 'children-service', url: '/admin/ministry/children-ministry', icon: <ChildrenSvgDyn style={iconStyle} /> },
    ]

    return <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '100%',
        borderBottom: '1px solid #1C1D221A', py: 2, mb: 3
    }}>
        {tabs.map((item, index) => {
            const isSelected = currentTabId === item.id;
            return <Button variant='contained' href={item.url} key={index} sx={{
                display: 'flex', alignItems: 'center', px: 2, py: 1, color: isSelected ? 'white' : 'black',
                bgcolor: isSelected ? 'primary.main' : '#F2F2F2', mr: 2, borderRadius: '16px'
            }}>
                {item.icon} <Typography sx={{ ml: 1, fontSize: 12, fontWeight: 600 }}>
                    {item.label}
                </Typography>
            </Button>
        })}
    </Box>
}