import { Box, Typography } from "@mui/material";
import moment from "moment";
import { FacebookSvg, LocationSvg, PhoneSvg, SearchSvg, YoutubeSvg } from "@/public/icons/icons"
import Logo from "./SiteLogo";


const iconStyle1 = { marginRight: '8px', /* color: darkMode ? '#D5D5D5' : 'inherit' */ }
const textStyle = { fontSize: 14, fontWeight: 500, marginRight: 2,/*  color: darkMode ? '#D5D5D5' : 'inherit' */ }
const iconStyle3 = {
    /* marginRight: '30px',  */height: '30px', width: '30px', /* color: darkMode ? '#D5D5D5' : 'inherit', */
    cursor: 'pointer'
}
const iconStyle4 = { color: '#0E60BF', /* color: darkMode ? '#D5D5D5' : 'inherit' */ }


export default function Footer() {
    return <Box sx={{
        background: '#0B2645', position: 'relative', textAlign: 'center', py: 1.5, mt: 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
        flexDirection: { xs: 'column', md: 'row' }, flexWrap: { xs: 'wrap', lg: 'nowrap' }
    }}>
        <Logo />

        {/*   <Box sx={{ flexGrow: 1 }} /> */}

        <Typography sx={{
            color: 'white', order: { xs: 4, md: 'inherit' },
            fontSize: 14, fontWeight: 500, opacity: '50%', my: { xs: 1.5, md: 0 }
        }}>
            © {moment().format('yyyy')} | Calvary Chapel of Turku
        </Typography>

        {/*   <Box sx={{ flexGrow: 1 }} /> */}

        <Box sx={{
            display: 'flex', alignItems: 'center', color: 'white',
            flexDirection: { xs: 'column', md: 'row' }
        }}>
            <Box sx={{ display: { xs: 'flex' }, alignItems: 'center', my: { xs: 1.5, md: 0 } }}>
                <Box sx={{ display: { xs: 'flex' }, }}>
                    <LocationSvg style={iconStyle1} />
                </Box>

                <Typography sx={{ ...textStyle, display: { xs: 'flex' } }}>
                    Takamaantie 15 20720 Turku
                </Typography>
            </Box>

            <Box sx={{ display: { xs: 'flex' }, alignItems: 'center', }}>
                <Box sx={{ display: { xs: 'flex' } }}>
                    <PhoneSvg style={iconStyle1} />
                </Box>

                <Typography sx={{ ...textStyle, display: { xs: 'flex' } }}>
                    +358 987 789 23
                </Typography>
            </Box>


            <Box sx={{ display: { xs: 'flex' }, alignItems: 'center', my: { xs: 1.5, md: 0 } }}>
                <Box sx={{ display: { xs: 'flex' }, mr: { xs: '30px', md: '20px', lg: '30px' } }}>
                    <FacebookSvg style={iconStyle3} />
                </Box>

                <Box sx={{ display: { xs: 'flex' }, mr: { xs: '30px', md: '20px', lg: '30px' } }}>
                    <YoutubeSvg style={iconStyle3} />
                </Box>
            </Box>

        </Box>

    </Box>
}