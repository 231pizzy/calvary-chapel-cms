import { Box, Button, Typography } from "@mui/material";
import CMSLayout from "../CMSLayout";
import { BibleDynSvg, ConferenceDynSvg, FooterSvg, GuestSpeakerDynSvg, HeaderSvg, LiveLinkSvg, LocationSvg, MetaSvg, TopicalStudiesDynSvg } from "@/public/icons/icons";

export default function SettingLayout({ pageTitle, section, subsection, headComponentArray, children }) {
    const iconStyle = { width: '20px', height: '20px' };

    const sections = [
        {
            label: 'Site information', id: 'siteInformation', url: '/admin/header', subsections: [
                { label: 'Header', id: 'header', url: '/admin/header', icon: <HeaderSvg style={iconStyle} /> },
                { label: 'Footer', id: 'footer', url: '/admin/footer', icon: <FooterSvg style={iconStyle} /> },
                { label: 'Location', id: 'location', url: '/admin/location', icon: <LocationSvg style={iconStyle} /> },
                { label: 'Meta Information', id: 'meta', url: '/admin/meta', icon: <MetaSvg style={iconStyle} /> },
                { label: 'Live Link', id: 'liveLink', url: '/admin/live-link', icon: <LiveLinkSvg style={iconStyle} /> },
            ]
        },
        {
            label: 'Resources', id: 'resources', url: '/admin/resources/guest-speakers', subsections: [
                { label: 'Guest Speakers', id: 'guestSpeakers', url: '/admin/resources/guest-speakers', icon: <GuestSpeakerDynSvg style={iconStyle} /> },
                { label: 'Bible Characters', id: 'bibleCharacters', url: '/admin/resources/bible-characters', icon: <BibleDynSvg style={iconStyle} /> },
                { label: 'Topical Studies', id: 'topicalStudies', url: '/admin/resources/topical-characters', icon: <TopicalStudiesDynSvg style={iconStyle} /> },
                { label: 'Conferences', id: 'conferences', url: '/admin/resources/conferences', icon: <ConferenceDynSvg style={iconStyle} /> },
            ]
        },
        {
            label: 'Contact', id: 'contact', url: '/admin/contact/prayer-request-topics', subsections: [
                { label: 'Contact Form Options', id: 'contactForm', url: '/admin/contact/prayer-request-topics', /* icon: <GuestSpeakerDynSvg style={iconStyle} /> */ },
                { label: 'Contact Enquiry Email', id: 'contactEmail', url: '/admin/contact/contact-email', /* icon: <BibleDynSvg style={iconStyle} /> */ },
            ]
        },
    ]

    const tabs = sections.find(i => i?.id === section).subsections

    return <CMSLayout menuId='settings' pageTitle={`Settings/${pageTitle}`} headComponentArray={headComponentArray}>
        <Box sx={{ height: 'calc(100vh - 60px)', overflowY: 'hidden' }}>
            <Box sx={{ maxWidth: '100%', display: 'flex' }}>
                {sections.map((tab, index) => {
                    const isSelected = section === tab.id;
                    return <Box key={index} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Button href={tab.url} variant='text' sx={{
                            py: 1.5, bgcolor: isSelected ? '#E6F1FF' : '#F5F5F5', textAlign: 'center',
                            color: isSelected ? 'primary.main' : 'black', width: '100%', cursor: 'pointer',
                            borderBottom: `2px solid ${isSelected ? '#0E60BF' : '#F5F5F5'}`, fontWeight: 600
                        }}>
                            {tab.label}
                        </Button>
                    </Box>
                })}
            </Box>

            {tabs?.length > 0 &&
                <Box sx={{
                    display: 'flex', justifyContent: 'center', py: 2, width: '100%',
                    borderBottom: '1px solid #1C1D221A'
                }}>
                    {tabs?.map((item, index) => {
                        const isCurrentTab = item?.id === subsection;

                        return <Button variant='contained' href={item.url} key={index} sx={{
                            display: 'flex', alignItems: 'center', px: 2, py: 1, color: isCurrentTab ? 'white' : 'black',
                            bgcolor: isCurrentTab ? 'primary.main' : '#F2F2F2', mr: 3, borderRadius: '16px'
                        }}>
                            {item.icon} <Typography sx={{ ml: item?.icon ? 1 : 0, fontSize: 12, fontWeight: 600 }}>
                                {item.label}
                            </Typography>
                        </Button>
                    })}
                </Box>}

            <Box sx={{ height: `calc(100vh - ${section === 'contact' ? '112px' : '175px'})`, overflowY: 'auto' }}>
                {children}
            </Box>
        </Box>

    </CMSLayout>
}