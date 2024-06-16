'use client'

import { BibleStudyDynSvg, BibleStudySvg, ChildrenSvgDyn, ConferenceDynSvg, MenSvgDyn, PulpitDynSvg, PulpitSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import { Box, Typography, useTheme } from "@mui/material";
import moment from "moment";

export default function OurService({ serviceArray }) {
    const iconStyle = {
        marginRight: '8px', height: '25px', width: 'auto',
        color: 'black'
    }

    const services = {
        'sunday_service': {
            title: 'Sunday Service', icon: <PulpitDynSvg style={iconStyle} />
        },
        'wednesday_service': {
            title: 'Wednesday Service', icon: <BibleStudyDynSvg style={iconStyle} />
        },
        'conference': {
            title: 'Conference', icon: <ConferenceDynSvg style={iconStyle} />
        },
        'men_ministry': {
            title: "Men's Ministry", icon: <MenSvgDyn style={iconStyle} />
        },
        'Women_ministry': {
            title: "Women's Ministry", icon: <WomenSvgDyn style={iconStyle} />
        },
        'youth_ministry': {
            title: "Youth's Ministry", icon: <YouthSvgDyn style={iconStyle} />
        },
        'children_minstry': {
            title: "Children's Ministry", icon: <ChildrenSvgDyn style={iconStyle} />
        },
    }



    return <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 'max-content', zIndex: 242424,
        mx: 'auto', border: '2px solid #B3D4FB', padding: '12px 24px',
        borderRadius: '16px', mt: { xs: -1, md: -6 }, position: 'relative', flexWrap: 'wrap',
        backgroundColor: 'background.default',
        boxShadow: '0px 10px 20px 0px #0000001A,0px 8px 12px 0px #00000014'
    }}>
        <Typography sx={{ color: '#0E60BF', fontWeight: 500, minWidth: 'max-content', mb: { xs: 2, md: 1 }, mr: 2 }}>
            Our Weekly Services
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
            {serviceArray?.map((item, index) => {
                const id = item?.id;
                const serviceObject = services[id]

                return <Box key={index} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', borderRadius: '12px',
                    backgroundColor: '#F5F9FF', color: 'primary.main', boxShadow: '0px 8px 16px 0px #0000000F',
                    fontSize: 16, fontWeight: 700, boxShadow: '0px 8px 16px 0px #0000000F',
                    border: '1px solid #C6DEFF',
                    mb: { xs: 2, md: 1 }, cursor: 'pointer', height: '70px', mx: { xs: 1, md: 0 }, mr: { md: 1 }
                }}>
                    {serviceObject?.icon}
                    <Box>
                        <Typography sx={{ color: 'text.primary', fontSize: 14, fontWeight: 700 }}>
                            {serviceObject?.title}
                        </Typography>
                        <Typography sx={{
                            color: 'text.secondary', marginTop: '4px', display: 'flex',
                            flexWrap: 'nowrap', fontWeight: 500, fontSize: 12
                        }}>
                            {moment(item?.startTime, 'hh:mm').format('h:mm a')}  (every week)
                        </Typography>
                    </Box>
                </Box>
            })}
        </Box>

    </Box>
}