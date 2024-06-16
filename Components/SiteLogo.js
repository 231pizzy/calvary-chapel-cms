'use client'

import { SiteLogo } from "@/public/icons/icons";
import { Box, Typography, useTheme } from "@mui/material";
import Link from "next/link";

export default function Logo({ isHeader }) {
    const darkMode = useTheme().palette.mode === 'dark'
    return <Link href={'/'} style={{ textDecoration: 'none', }}>
        <Box sx={{
            display: 'flex', alignItems: 'center',
            color: isHeader ? '#0E60BF' : 'white'
        }}>
            <SiteLogo style={{ height: '20px', width: '50px' }} />
            <Typography sx={{ fontSize: { xs: 15, } }}>
                Calvary  Chapel Turku
            </Typography>

        </Box>
    </Link>
}