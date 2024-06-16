'use client'

import { Box, Typography } from "@mui/material";
import IconElement from "./IconElement";
import { textValues } from "@/utils/textValues";
import { SiteLogoSvg } from "@/public/icons/icons";

const backgroundImage = '/images/sidebarBg.png'
const siteLogo = '/images/sitelogo.svg';

export default function HomeSideImage() {
    return <Box sx={{
        position: 'relative', width: { xs: '100vw', md: '50vw' },
        height: { xs: 'max-content', md: '100vh' },
    }}>

        {/* Background Image */}
        <IconElement {...{
            src: backgroundImage, style: {
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%', zIndex: 1
            }
        }} />

        {/* Overlay */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, objectFit: 'cover',
            bottom: 0, background: '#052F61D9', zIndex: 2,
        }}></div>

        {/* Site title */}
        <Box sx={{
            display: { xs: 'none', md: 'flex' }, alignItems: 'center', position: 'absolute', width: 'max-content',
            height: 'max-content', top: 12, left: 12, zIndex: 443434, color: 'white'
        }}>
            {/*  <IconElement {...{
                src: siteLogo, style: {
                    height: '20px', width: '20px', zIndex: 1, color: 'white'
                }
            }} /> */}
            <SiteLogoSvg style={{ color: 'white', height: '30px', width: '30px', }} />

            <Typography sx={{ fontSize: 15, fontWeight: 700, ml: 1, color: 'white' }}>
                {textValues.sidebar.siteName}
            </Typography>
        </Box>

        {/* Write up */}
        <Box sx={{
            display: 'flex', flexDirection: 'column', height: '100%', maxWidth: { xs: '90%', md: '80%', lg: '70%' },
            justifyContent: { xs: 'space-evenly', md: 'center' }, alignItems: 'center',
            zIndex: 3, position: 'relative', mx: 'auto', py: { xs: 2, md: 0 },
        }}>
            {/* Company name */}
            <Typography sx={{
                fontWeight: 700, fontSize: { xs: 24, md: 30, lg: 35, xl: 50 }, color: 'white', textAlign: 'center',
                mb: 3
            }}>
                {textValues.sidebar.title}
            </Typography>

            {/* Content */}
            <Typography sx={{
                fontWeight: 500, textAlign: 'center', fontSize: { xs: 14, md: 16, lg: 20 }, color: 'white'
            }}>
                {textValues.sidebar.description}
            </Typography>
        </Box>
    </Box>
}