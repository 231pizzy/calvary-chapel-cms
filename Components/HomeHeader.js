'use client'

import { Box, Button, Typography } from "@mui/material";
import IconElement from "./IconElement";
import { usePathname, useRouter } from "next/navigation";

import BackIcon from '@mui/icons-material/KeyboardArrowLeft';
import { textValues } from "@/utils/textValues";

const siteLogo = '/images/sitelogo.svg';

export default function HomeHeader({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const goback = () => {
        router.back();
    }

    const getPageName = () => {
        let pageName = '';
        switch (pathname) {
            case '/login':
                pageName = 'Sign In';
                break;
            case '/receive-otp':
                pageName = 'Forgot Password';
                break;
            case '/link-sent':
                pageName = 'Check Your Email';
                break;
            case '/new-password':
                pageName = 'Reset Password';
                break;
            case '/password-changed':
                pageName = 'Password Created Successfully';
                break;
        }

        return pageName;
    }

    const routesWithBackButton = [
        '/input-otp', '/receive-otp', '/link-sent'
    ]


    return <Box sx={{
        display: 'flex', flexDirection: 'column', mx: 'auto', height: { xs: 'max-content', md: '100vh' }, position: 'relative',
        justifyContent: 'center', alignItems: 'center', p: 4, pt: 1, width: { xs: '80vw', sm: '80vw', md: '30vw' },
    }}>
        {/* Back button */}
        {routesWithBackButton.includes(pathname) &&
            <Button onClick={goback}
                sx={{ fontsize: { xs: 12 }, position: 'absolute', left: -60, color: 'black', top: 20, }}>
                <BackIcon sx={{ fontSize: 20, cursor: 'pointer' }} />
                Back
            </Button>}

        {/* Logo */}
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 'max-content',
            mx: 'auto'
        }}>
            <Box sx={{
                height: { xs: '40px', sm: '100px', md: '100px', lg: '100px' },
                width: { xs: '40px', sm: '100px', md: '100px', lg: '100px' }
            }}>
                <IconElement {...{ src: siteLogo, style: { height: '100%', width: '100%' } }} />
            </Box>
            <Typography sx={{ color: 'primary.main', fontSize: { xs: 14, md: 16 }, fontWeight: 600 }}>
                {textValues.sidebar.siteName}
            </Typography>

            {getPageName() === 'Sign In' && <Typography sx={{
                fontSize: { xs: 12, md: 14 }, mt: { xs: 1 },
                textAlign: 'center', fontWeight: 400
            }}>
                {textValues.login.info}
            </Typography>}
        </Box>


        <Box sx={{
            my: 3, width: { xs: '100%', sm: '80%', md: '70%' }, border: '3px solid #E6F1FF', borderRadius: '16px',
            boxShadow: '0px 8px 16px 0px #0000000F', px: { xs: 2, md: 4, lg: 5 }, py: { xs: 1 }
        }}>
            {/* Page name */}
            <Typography sx={{
                textTransform: 'capitalize', mt: 2, fontSize: { xs: 16, md: 18, lg: 18 },
                fontWeight: 700, color: 'primary.main', textAlign: 'center'
            }}>
                {getPageName()}
            </Typography>

            {/* Children */}
            <Box sx={{
                my: 1,
            }}>
                {children}
            </Box>
        </Box>
    </Box>
}