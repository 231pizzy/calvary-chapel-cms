import { BibleDynSvg, BibleStudyDynSvg, CharacterStudiesDynSvg, ChildrenSvgDyn, ConferenceDynSvg, FaithSvgDyn, GuestSpeakerDynSvg, LeadershipSvgDyn, MenSvgDyn, MinistrySvg, NoteSvgDyn, PulpitDynSvg, ResourceSvg, ScheduleSvg, TopicalStudiesDynSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import { Box, Button, Typography, useTheme } from "@mui/material";

export default function SecondSideBar({ selectedMenu }) {
    const darkMode = useTheme().palette.mode === 'dark';

    const sideBarButton = ({ label, onclick, iconSrc, id, index, justifySelf, notLink }) => {
        //const selected = state.selectedMenu === id;

        return (
            <Button href={notLink ? null : `/${id}`} onClick={onclick ? onclick : () => { }} sx={{
                display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, px: 2, py: 1, mb: 1,
                minWidth: { xs: '60vw', sm: '30vw', md: 0 }, minWidth: 'max-content',
                color: /* selected ? 'primary.main' : */ 'text.primary',
                cursor: 'pointer', ":hover": { background: 'primary.main', color: 'black' },
                justifyContent: { xs: 'flex-start', }, alignItems: 'center',
                flexDirection: { xs: 'row', }, flexWrap: 'nowrap',
            }}>
                {iconSrc}
                <Typography key={index} id={id} onClick={onclick}
                    sx={{
                        fontSize: { xs: 15, md: 14 }, ml: 2
                    }} >
                    {label}
                </Typography>
            </Button>
        )
    }

    const iconStyle = { height: '20px', width: '20px', }



    const ministrySubMenu = [
        { label: `Men's Ministry`, route: 'ministry?ministry=men-service', icon: <MenSvgDyn style={{ ...iconStyle }} />, },
        { label: `Women's Ministry`, route: 'ministry?ministry=women-service', icon: <WomenSvgDyn style={{ ...iconStyle }} />, },
        { label: `Youth's Ministry`, route: 'ministry?ministry=youth-service', icon: <YouthSvgDyn style={{ ...iconStyle }} />, },
        { label: `Children's Ministry`, route: 'ministry?ministry=children-service', icon: <ChildrenSvgDyn style={{ ...iconStyle }} />, },
    ]

    const resourceSubMenu = [
        { label: 'Verse by verse', route: 'resources/verse-by-verse', icon: <BibleDynSvg style={{ ...iconStyle }} />, },
        { label: 'Wednesday Services', route: 'resources/wednesday-service', icon: <BibleStudyDynSvg style={{ ...iconStyle }} />, },
        { label: 'Sunday Services', route: 'resources/sunday-service', icon: <PulpitDynSvg style={{ ...iconStyle }} />, },
        { label: 'Guest speakers', route: 'resources/guest-speakers', icon: <GuestSpeakerDynSvg style={{ ...iconStyle }} />, },
        { label: 'Character studies', route: 'resources/character-studies', icon: <CharacterStudiesDynSvg style={{ ...iconStyle }} />, },
        { label: 'Topical studies', route: 'resources/topical-studies', icon: <TopicalStudiesDynSvg style={{ ...iconStyle }} />, },
        { label: 'Conferences', route: 'resources/conferences', icon: <ConferenceDynSvg style={{ ...iconStyle }} />, },
    ]

    const aboutSubMenu = [
        { label: 'History of CCT', route: 'about?view=history', icon: <NoteSvgDyn style={{ ...iconStyle }} />, },
        { label: 'Statement of Faith', route: 'about?view=statement-of-faith', icon: <FaithSvgDyn style={{ ...iconStyle }} />, },
        { label: 'Leadership', route: 'about?view=leadership', icon: <LeadershipSvgDyn style={{ ...iconStyle }} />, },
    ]


    const menuMapping = {
        ministry: ministrySubMenu,
        resources: resourceSubMenu,
        about: aboutSubMenu
    }

    return <Box sx={{
        position: { xs: 'absolute', }, minWidth: 'max-content', maxWidth: 'max-content', zIndex: 11343411,
        top: 40, left: 0, right: 0, maxHeight: { md: 'max-content' }, px: 1,
        backgroundColor: { xs: darkMode ? '#18212D' : 'secondary.main' }, borderRadius: '12px',
        borderRight: darkMode ? '1px solid #18212D' : '1px solid #C5C5C5',
        display: { xs: /* isMenuOpen ? 'block' : */ 'none', md: 'block' },
        boxShadow: '0px 10px 20px 0px #0000001A,0px 8px 12px 0px #00000014',
        overflowY: { md: 'auto' }
    }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', py: 1, maxHeight: 'max-content' }}>
            {menuMapping[selectedMenu].map((data, index) => {
                const id = data?.route;
                return <Box key={index}>
                    {sideBarButton({
                        label: data.label, onclick: data.processor, id: id,
                        iconSrc: data.icon, index: index
                    })}
                </Box>
            })}

        </Box>
    </Box>
}