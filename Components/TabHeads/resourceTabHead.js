import {
    ChildrenSvgDyn, FaithSvgDyn, LeadershipSvgDyn, BibleDynSvg, PulpitDynSvg, GuestSpeakerDynSvg, TopicalStudiesDynSvg,
    MenSvgDyn, NoteSvgDyn, BibleStudyDynSvg, WomenSvgDyn, YouthSvgDyn, ConferenceDynSvg
} from "@/public/icons/icons";
import { Box, Button, Typography } from "@mui/material";

export default function ResourceTabHead({ currentTabId }) {

    const iconStyle = { width: '20px', height: '20px', }
    const tabs = [
        { label: "Verse By Verse", id: 'verse-by-verse', url: '/admin/resources/hero?page=verse-by-verse', icon: <BibleDynSvg style={iconStyle} /> },
        { label: "Wednesday Services", id: 'wednesday-service', url: '/admin/resources/hero?page=wednesday-service', icon: <BibleStudyDynSvg style={iconStyle} /> },
        { label: "Sunday Service", id: 'sunday-service', url: '/admin/resources/hero?page=sunday-service', icon: <PulpitDynSvg style={iconStyle} /> },
        { label: "Guest Speakers", id: 'guest-speakers', url: '/admin/resources/hero?page=guest-speakers', icon: <GuestSpeakerDynSvg style={iconStyle} /> },
        { label: "Topical Studies", id: 'topical-studies', url: '/admin/resources/hero?page=topical-studies', icon: <TopicalStudiesDynSvg style={iconStyle} /> },
        { label: "Conferences", id: 'conferences', url: '/admin/resources/hero?page=conferences', icon: <ConferenceDynSvg style={iconStyle} /> },
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