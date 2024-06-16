'use client'

import { Box, Button, useTheme } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    BibleDynSvg, BibleStudyDynSvg, CharacterStudiesDynSvg, ConferenceDynSvg,
    GuestSpeakerDynSvg, PulpitDynSvg, TopicalStudiesDynSvg
} from "@/public/icons/icons";


export default function TabHead() {
    const [currentTab, setCurrentTab] = useState(null);
    const iconStyle2 = { height: '25px', width: '25px', marginRight: '12px' };

    const darkMode = useTheme().palette.mode === 'dark';

    const pathName = usePathname();
    const router = useRouter();
    const params = useSearchParams();
    const currentPath = pathName.split('/').pop()

    const paths = ['verse-by-verse', 'conferences', 'guest-speakers', 'character-studies',
        'sunday-service', 'wednesday-service', 'topical-studies', '']

    useEffect(() => {
        paths.forEach(item => router.prefetch(`/resources/${item}`))
        if (paths.includes(currentPath))
            setCurrentTab(currentPath);
        else setCurrentTab('verse-by-verse');
    }, [])

    const tabs = {
        'verse-by-verse': {
            label: "Verse By Verse", value: 'verse-by-verse', icon: <BibleDynSvg style={iconStyle2} />,
        },
        'wednesday-service': {
            label: "Wednesday Services", value: 'wednesday-service',
            icon: <BibleStudyDynSvg style={iconStyle2} />, component: <div />
        },
        'sunday-service': {
            label: "Sunday Services", value: 'sunday-service',
            icon: <PulpitDynSvg style={iconStyle2} />, component: <div />
        },
        'guest-speakers': {
            label: "Guest Speakers", value: 'guest-speakers',
            icon: <GuestSpeakerDynSvg style={iconStyle2} />, component: <div />
        },
        'character-studies': {
            label: "Character Studies", value: 'character-studies',
            icon: <CharacterStudiesDynSvg style={iconStyle2} />, component: <div />
        },
        'topical-studies': {
            label: "Topical Studies", value: 'topical-studies',
            icon: <TopicalStudiesDynSvg style={iconStyle2} />, component: <div />
        },
        'conferences': {
            label: "Conferences", value: 'conferences',
            icon: <ConferenceDynSvg style={iconStyle2} />, component: <div />
        },
    }

    const handleChangeTab = (id) => {
        // setCurrentTab(id)
        // window.location.pathname = `/resources/${id}`
        router.push(`/resources/${id}`)
    }

    const tabStyle = {
        fontSize: { xs: 14, md: 16 }, fontWeight: 600, py: 1.5, px: 2, borderRadius: '32px',
        my: 2, minWidth: 'max-content',
        color: 'primary.main', backgroundColor: darkMode ? '#0A2342' : 'secondary.main', mx: { xs: 2, md: 4 }
    }
    const selectedTabStyle = { color: 'secondary.main', backgroundColor: 'primary.main' }

    //  const selectedTabData = tabs[currentTab] //tabs.find(item => item.value === currentTab)

    return <Box sx={{
        display: 'flex', alignItems: 'center', flexWrap: { xs: 'nowrap', md: 'wrap' }, mb: 2, pt: 2,
        overflowX: { xs: 'auto', md: 'inherit' }
    }}>
        {Object.values(tabs).map((item, index) => {
            const selected = currentTab === item.value
            return <Button key={index} id={item.value} onClick={() => { handleChangeTab(item.value) }}
                variant="contained" sx={{ ...tabStyle, ...(selected ? selectedTabStyle : {}) }}>
                {item.icon}  {item.label}
            </Button>
        })}
    </Box>
}