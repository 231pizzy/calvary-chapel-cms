import { BibleStudySvg, ChildrenSvg, ConferenceSvg, MenSvg, PulpitSvg, WomenSvg, YouthSvg } from "@/public/icons/icons";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import ArrowLeft from '@mui/icons-material/KeyboardArrowLeft'


const iconStyle2 = { marginRight: '8px', height: '24px', width: '24px' }

const serviceTypes = {
    'men-service': { label: "Men's Ministry", value: 'men-service', icon: <MenSvg style={iconStyle2} /> },
    'women-service': { label: "Women's Ministry", value: 'women-service', icon: <WomenSvg style={iconStyle2} /> },
    'sunday-service': { label: "Sunday Service", value: 'sunday-service', icon: <PulpitSvg style={iconStyle2} /> },
    'wednesday-service': { label: "Wednesday Service", value: 'men-service', icon: <BibleStudySvg style={iconStyle2} /> },
    'conference-service': { label: "Conference", value: 'conference-service', icon: <ConferenceSvg style={iconStyle2} /> },
    'youth-service': { label: "Youth Ministry", value: 'youth-service', icon: <YouthSvg style={iconStyle2} /> },
    'children-service': { label: "Children's Ministry", value: 'children-service', icon: <ChildrenSvg style={iconStyle2} /> }
}

export default function ScheduleDetail({ details, closeModal }) {
    const darkMode = useTheme().palette.mode === 'dark';

    const detailValue = ({ label, value, icon, noFlex }) => {
        return <Box container sx={{
            display: 'flex', flexDirection: noFlex ? 'column' : 'row',
            alignItems: 'flex-start', mb: 3
        }}>
            <Typography sx={{
                fontSize: 13, fontWeight: 600, maxWidth: 'max-content', mr: 4,
                px: 1, py: .5, borderRadius: '8px', mb: noFlex ? 1 : 0,
                color: 'primary.main', backgroundColor: darkMode ? '#042D5D' : 'secondary.main',
                minWidth: '100px', maxWidth: '100px'
            }} >
                {label}:
            </Typography>

            <Typography sx={{ fontSize: 14, color: 'text.secondary', fontWeight: 400, display: 'flex', alignItems: 'center' }} >
                {icon && icon} {value}
            </Typography>
        </Box>
    }

    return <Box sx={{
        backgroundColor: darkMode ? 'black' : 'white', borderRadius: '16px', boxShadow: '0px 8px 16px 0px #0000000F',
        maxWidth: { xs: 'none', md: '30vw', lg: '25vw' }, border: darkMode ? '1px solid #042D5D' : '1px solid #97C6FE',
        my: { xs: 4, md: 6 }, mx: 2, maxHeight: '80vh', overflowY: 'hidden'
    }}>
        <Typography sx={{
            py: 2, px: 2, textAlign: 'center', color: 'text.secondary', display: 'flex', alignItems: 'center',
            fontSize: 20, fontWeight: 700, borderBottom: darkMode ? '1px solid #232323' : '1px solid #1414171A'
        }}>
            <Typography sx={{
                fontSize: 24, float: 'left', cursor: 'pointer', fontSize: 14, my: 'auto',
                display: 'flex', alignItems: 'center', color: 'primary.main'
            }} onClick={closeModal} >
                <ArrowLeft /> Back
            </Typography>
            <div style={{ flexGrow: 1 }} />
            Information
            <div style={{ flexGrow: 1 }} />
        </Typography>

        <Box container sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start',
            px: 2, py: 2, overflowY: 'auto', maxHeight: '65vh'
        }}>
            {details?.title && detailValue({ label: 'Service title', value: details?.title, noFlex: true })}
            {details?.details && detailValue({ label: 'Details', value: details?.details, noFlex: true })}
            {details?.venue && detailValue({ label: 'Location', value: details?.venue })}
            {details?.type && detailValue({
                label: 'Service', value: serviceTypes[details.type].label,
                icon: serviceTypes[details.type].icon
            })}
            {details?.date && detailValue({ label: 'Date', value: details?.date })}
            {details?.time && detailValue({ label: 'Time', value: details?.time })}
            {details?.duration && detailValue({ label: 'Duration', value: details?.duration })}
            {details?.preacher && detailValue({ label: 'Preacher', value: details?.preacher })}
        </Box>
    </Box>
}