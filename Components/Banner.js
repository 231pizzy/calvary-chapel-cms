import { Box, Button, InputAdornment, OutlinedInput, Typography, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import Breadcrumb from "./BreadCrumb";

export default function Banner({ title, subtitle, image, search }) {
    const path = usePathname();
    const darkMode = useTheme().palette.mode === 'dark';

    const currentRoot = path.split('/')[1]
    console.log('current root', currentRoot);

    const getData = () => {
        switch (currentRoot) {
            case '':
                return {
                    title: 'WELCOME TO CALVARY CHAPEL TURKU',
                    subtitle: null, //'Calvary Chapel is an international, non-denominational church. Our most noticeable distinctive is the emphasis we place on the Word of God: we believe the Bible to the inspired and inerrant revelation of God, and we teach it in our services book by book and verse by verse.',
                    search: false,
                    image: '/images/home.png'
                };
            case 'ministry':
                return {
                    title: 'Our Ministry',
                    subtitle: '' /* 'Lorem ipsum dolor sit amet consectetur. Nisl posuere sagittis fames ridiculus sagittis. Et massa velit lacus enim gravida lorem sagittis urna sed. Sed congue nibh in tellus in. Turpis fames mattis dignissim sagittis. A amet aliquam morbi non cras facilisis purus' */,
                    search: false,
                    image: '/images/ministry.png'
                };
            case 'resources':
                return {
                    title: 'Our Resources',
                    subtitle: '' /* 'Lorem ipsum dolor sit amet consectetur. Nisl posuere sagittis fames ridiculus sagittis. Et massa velit lacus enim gravida lorem sagittis urna sed. Sed congue nibh in tellus in. Turpis fames mattis dignissim sagittis. A amet aliquam morbi non cras facilisis purus' */,
                    search: true,
                    image: '/images/resource.png'
                };
            case 'schedule':
                return {
                    title: 'Our Schedule',
                    subtitle: '' /* 'Lorem ipsum dolor sit amet consectetur. Nisl posuere sagittis fames ridiculus sagittis. Et massa velit lacus enim gravida lorem sagittis urna sed. Sed congue nibh in tellus in. Turpis fames mattis dignissim sagittis. A amet aliquam morbi non cras facilisis purus' */,
                    search: false,
                    image: '/images/schedule.png'
                };
            case 'about':
                return {
                    title: 'ABOUT  CALVARY CHAPEL TURKU',
                    subtitle: '' /* 'Calvary Chapel Turku began in 2005 in a small apartment in Varissuo Turku as a home Bible Study. Since then CCT has been steadily teaching through the Bible with two weekly services, one on Sunday and a midweek service on Wednesday evening. Since the time of those original Bible studies in Varissuo, CCT has relocated to Takamaantie 15 to accommodate the growing number of people and ministries within the church.' */,
                    search: false,
                    image: '/images/about.png'
                };
            case 'contact':
                return {
                    title: 'Contact Us',
                    subtitle: 'Calvary Chapel Turku gathers in Luolavuori multiple times a week, please find more information below',
                    search: false,
                    image: '/images/contact.png'
                };
        }
    }


    return <Box sx={{
        backgroundImage: `url(${image})`, backgroundSize: '100% 100%', position: 'relative', display: 'flex',
        justifyContent: 'center', alignItems: 'center', backgroundRepeat: 'no-repeat',
        maxHeight: { xs: 'max-content', md: '200px', lg: '300px' }, minHeight: { xs: 'max-content', md: '200px', lg: '300px' }
    }}>
        <div style={{
            position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden',
            backgroundColor: '#052F61BF', opacity: '90%'
        }}>

        </div>

        <Box sx={{
            textAlign: 'center', py: { xs: 2, md: 4, lg: 6 }, position: 'relative', overflow: 'hidden',
            zIndex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            maxHeight: '100%', width: { xs: '99%' }
        }}>

            <Typography sx={{
                color: '#D5D5D5', fontSize: { xs: 26, lg: 40 }, zIndex: 5, fontWeight: 700,
                lineHeight: { xs: '40px', md: '60px' },
                mb: { xs: 1, md: 3 }, textTransform: 'uppercase', maxWidth: { xs: '90vw', sm: 'inherit' }
            }}>
                {title}
            </Typography>

            {!search && subtitle && <Typography sx={{
                color: '#D5D5D5', fontSize: { xs: 14, md: 16 }, maxWidth: { xs: '90%', md: '90%', lg: '90%' },
                whiteSpace: 'break-spaces', fontWeight: 500, lineHeight: { xs: '24px', md: '24px' }, opacity: '100%', zindex: 5,
            }} dangerouslySetInnerHTML={{ __html: subtitle }}>
            </Typography>}

            {search && <OutlinedInput
                placeholder="Search for anything"
                endAdornment={<InputAdornment position="end" sx={{
                }}>
                    <Button variant="contained" sx={{
                        height: { xs: '40px', md: '60px' },
                        fontWeight: 600, fontSize: { xs: 16, md: 20 }
                    }}>
                        Search
                    </Button>
                </InputAdornment>}

                sx={{
                    height: { xs: '40px', md: '60px' }, paddingRight: 0, width: { xs: 'auto', lg: '400px' }, marginTop: 3,
                    fontSize: 14, backgroundColor: darkMode ? '#232323' : 'white', borderRadius: '12px', overflow: 'hidden'
                }}
            />}
        </Box>

    </Box>
}