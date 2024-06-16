import { AboutSvg, BibleDynSvg, BibleStudyDynSvg, CharacterStudiesDynSvg, ChildrenSvgDyn, ConferenceDynSvg, ContactSvg, FaithSvgDyn, GuestSpeakerDynSvg, HomePageSvg, HomeSvg, LeadershipSvgDyn, MenSvgDyn, MinistrySvg, PulpitDynSvg, ResourceSvg, ScheduleSvg, TopicalStudiesDynSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditButton from "../EditButton/EditButton";
import Loader from "../Loader/Loader";
import { getRequestHandler } from "../requestHandler";

export default function IndexView({ editUrl }) {
    const [data, setData] = useState(null);

    const sampleTitle = 'Lorem ipsum dolor sit amet consectetur sollicitudin.';
    const sampleDescription = 'Lorem ipsum dolor sit amet consectetur. In sem urna suscipit risus diam bibendum ac nunc imperdiet aliquam aliquam velit.'

    const mapping = {
        home: { title: 'Home', icon: <HomePageSvg /> },
        ministry: { title: 'Ministry', icon: <MinistrySvg /> },
        resources: { title: 'Resources', icon: <ResourceSvg /> },
        about: { title: 'About CCT', icon: <AboutSvg /> },
        schedule: { title: 'Schedule', icon: <ScheduleSvg /> },
        contact: { title: 'Contact', icon: <ContactSvg /> },


        homePage: { title: 'Home Page', icon: null },
        menMinistry: { title: `Men's Ministry Page`, icon: <MenSvgDyn /> },
        womenMinistry: { title: `Women's Ministry Page`, icon: <WomenSvgDyn /> },
        youthMinistry: { title: `Youth's Ministry Page`, icon: <YouthSvgDyn /> },
        childrenMinistry: { title: `Children's Ministry`, icon: <ChildrenSvgDyn /> },
        verseByVerse: { title: `Verse by Verse Page`, icon: <BibleDynSvg /> },
        wednesdayService: { title: 'Wednesday Service Page', icon: <BibleStudyDynSvg /> },
        sundayService: { title: 'Sunday Service Page', icon: <PulpitDynSvg /> },
        guestSpeaker: { title: 'Guest Speaker Page', icon: <GuestSpeakerDynSvg /> },
        bibleCharacter: { title: 'Bible Character Page', icon: <CharacterStudiesDynSvg /> },
        topicalStudies: { title: 'Topical Studies Page', icon: <TopicalStudiesDynSvg /> },
        conference: { title: 'Conference Page', icon: <ConferenceDynSvg /> },
        history: { title: 'History of CCT', icon: <AboutSvg /> },
        faith: { title: 'Statement of Faith', icon: <FaithSvgDyn /> },
        leadership: { title: 'Leadership', icon: <LeadershipSvgDyn /> },
        schedulePage: { title: 'Schedule', icon: <ScheduleSvg /> },
        contactPage: { title: 'Contact', icon: <ContactSvg /> },
    };

    const parents = [
        'home', 'ministry', 'resources', 'about', 'schedule', 'contact'
    ]


    const sections = [
        { id: '1', parent: 'home', tag: 'homePage', title: sampleTitle, description: sampleDescription },

        { id: '2', parent: 'ministry', tag: 'menMinistry', title: sampleTitle, description: sampleDescription },
        { id: '2', parent: 'ministry', tag: 'womenMinistry', title: sampleTitle, description: sampleDescription },
        { id: '2', parent: 'ministry', tag: 'youthMinistry', title: sampleTitle, description: sampleDescription },
        { id: '2', parent: 'ministry', tag: 'childrenMinistry', title: sampleTitle, description: sampleDescription },

        { id: '3', parent: 'resources', tag: 'verseByVerse', title: sampleTitle, description: sampleDescription },
        { id: '3', parent: 'resources', tag: 'wednesdayService', title: sampleTitle, description: sampleDescription },
        { id: '3', parent: 'resources', tag: 'sundayService', title: sampleTitle, description: sampleDescription },
        { id: '3', parent: 'resources', tag: 'guestSpeaker', title: sampleTitle, description: sampleDescription },
        { id: '3', parent: 'resources', tag: 'bibleCharacter', title: sampleTitle, description: sampleDescription },
        { id: '3', parent: 'resources', tag: 'topicalStudies', title: sampleTitle, description: sampleDescription },
        { id: '3', parent: 'resources', tag: 'conference', title: sampleTitle, description: sampleDescription },

        { id: '4', parent: 'about', tag: 'history', title: sampleTitle, description: sampleDescription },
        { id: '4', parent: 'about', tag: 'faith', title: sampleTitle, description: sampleDescription },
        { id: '4', parent: 'about', tag: 'leadership', title: sampleTitle, description: sampleDescription },

        { id: '1', parent: 'schedule', tag: 'schedulePage', title: sampleTitle, description: sampleDescription },
        { id: '1', parent: 'contact', tag: 'contactPage', title: sampleTitle, description: sampleDescription },
    ]

    useEffect(() => {
        getRequestHandler({
            route: `/api/all-meta`,
            successCallback: body => {
                const result = body?.result;
                if (result) {
                    setData(body?.result)
                }
                else {
                    setData([])
                }
            },
            errorCallback: err => {
                setData([])
                console.log('Something went wrong')
            }
        })
    }, [])


    return data ? <Box sx={{}}>
        {parents?.map((item, index) => {
            const children = sections?.filter(i => i?.parent === item);

            return <Box key={index} sx={{ maxWidth: '100%' }}>
                {/* Heading */}
                <Box sx={{
                    display: 'flex', pl: 2, py: 1, bgcolor: '#E6F1FF', color: 'primary.main',
                    border: '1px solid #1414171A', alignItems: 'center'
                }}>
                    {mapping[item]?.icon}

                    <Typography sx={{ ml: 2, fontWeight: 500 }}>
                        {mapping[item]?.title}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100%' }}>
                    {children.map((child, index) => {
                        const childObject = mapping[child.tag];
                        const childObjectData = data?.find(i => i?.tag === child?.tag)

                        return <Box key={index} sx={{
                            display: 'flex', flexDirection: 'column', px: 1.5, py: 1.5, borderRadius: '8px',
                            bgcolor: '#F5F5F5', width: '300px', border: '1px solid #1414171A', mx: 2, my: 2
                        }}>
                            {/* Heading */}
                            <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                    {childObject?.icon}
                                    <Typography sx={{ fontSize: 14, fontWeight: 500, ml: childObject?.icon ? 2 : 0 }}>
                                        {childObject?.title}
                                    </Typography>
                                </Box>

                                <EditButton url={`${editUrl}?tag=${child?.tag}&&parent=${child?.parent}&&name=${childObject?.title}`} dark={false} />
                            </Box>

                            {/* Content */}
                            <Box sx={{
                                display: 'flex', borderRadius: '8px', maxWidth: '100%',
                                flexDirection: 'column', px: 1, py: 1, bgcolor: 'white'
                            }}>
                                {/* Title */}
                                <Typography sx={{ color: 'primary.main', maxWidth: '90%', fontWeight: 600, fontSize: 14 }}>
                                    {childObjectData?.title ?? sampleTitle}
                                </Typography>

                                {/* Description */}
                                <Typography sx={{ fontWeight: 400, fontSize: 13, maxWidth: '100%' }}>
                                    {childObjectData?.description ?? sampleDescription}
                                </Typography>
                            </Box>
                        </Box>
                    })}
                </Box>
            </Box>
        })}
    </Box> : <Loader />
}