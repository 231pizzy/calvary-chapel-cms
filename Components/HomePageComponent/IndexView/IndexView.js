import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import { getRequestHandler } from "@/Components/requestHandler";
import { YoutubeRed } from "@/public/icons/icons";
import generateFileUrl from "@/utils/getImageUrl";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowRight from '@mui/icons-material/East'
import OurService from "@/Components/OurService";
import Loader from "@/Components/Loader/Loader";

export default function IndexView({ editUrl, preview, previewPayload }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);

    const router = useRouter();


    const sampleData = {
        banner: '/images/ministry.png', heroText: 'WELCOME TO CALVARY CHAPEL TURKU',
        heroSubtitle: `Calvary Chapel is an international, non-denominational church. Our most noticeable distinctive is the emphasis we place on the Word of God: we believe the Bible to the inspired and inerrant revelation of God, and we teach it in our services book by book and verse by verse.`,
        services: [{ id: 'sunday_service', startTime: '11:00' }, { id: 'wednesday_service', startTime: '19:00' },],

        navigation: [
            {
                title: 'title',
                details: 'details',//.required('Details is required'),
                link: '/',
                type: 'internal',
                logo: '/images/ministry.png',
                order: 1
            }
        ],

        externalNavigation: [
            {
                logo: '/images/ministry.png',
                title: 'title',
                link: 'https://youtube.com',
                type: 'external',
                order: 2
            }],
    }

    const navigations = data && ([...(data?.navigation ?? [])]).sort((a, b) => a?.order - b?.order)

    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(previewPayload);
        }
        else {
            //Get content
            getRequestHandler({
                route: `/api/homepage`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {
                        setData({
                            ...body?.result,
                            banner: generateFileUrl(body?.result?.banner),
                            navigation: body?.result?.navigation?.map(i => {
                                return { ...i, logo: i?.logo && generateFileUrl(i?.logo) }
                            })
                        })
                        setNoData(false)
                    }
                    else {
                        setData(sampleData)
                    }
                },
                errorCallback: err => {
                    setNoData(true);
                    setData({})
                    console.log('Something went wrong')
                }
            })
        }
    }, [])

    const handleEdit = () => {
        router.push(editUrl)
    }

    console.log('data', { data });

    return (data ?
        <Box sx={{
            display: 'flex', alignItems: { xs: 'center', lg: 'flex-start' },
            flexDirection: { xs: 'column-reverse', lg: 'row' }, overflow: preview ? 'auto' : 'inherit',
            maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            py: { xs: 1, md: 2, lg: 3 }, justifyContent: 'center',
        }}>
            {/* View */}
            <Box sx={{
                border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
                borderRadius: '24px', overflow:/*  preview ? 'auto' :  */'hidden',
                width: preview ? '98%' : { xs: '95%', lg: '80%' }, mx: 'auto',
            }}>
                {/* Banner */}
                <Banner image={data?.banner} title={data?.heroText} subtitle={data?.heroSubtitle} />

                {/* Main view */}
                <Box>
                    <OurService serviceArray={data?.services} />
                    <Box sx={{
                        display: 'flex', maxWidth: { xs: '90%', md: '90%' }, py: 4,
                        flexWrap: 'wrap', px: 2, justifyContent: 'center', mx: 'auto'
                    }}>
                        {navigations.map((item, index) => {
                            return item?.type === 'internal'
                                ? <Box key={index} sx={{
                                    borderRadius: '16px', maxWidth: { xs: '90%', md: '240px', }, mx: 'auto', border: '1px solid #1414171A',
                                    boxShadow: '0px 8px 16px 0px #0000000F', minWidth: '120px',
                                    py: 2, backgroundColor: 'inherit', mx: 2, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', mb: { xs: 3, md: 0 }
                                }}>
                                    <Typography sx={{
                                        color: 'primary.main', fontSize: 14, maxWidth: '85%', mx: 'auto',
                                        fontWeight: 700, mb: 2, textTransform: 'uppercase'
                                    }}>
                                        {item.title}
                                    </Typography>

                                    {item?.details && <Typography
                                        dangerouslySetInnerHTML={{ __html: item.details }} sx={{
                                            fontSize: 13, fontWeight: 400, maxWidth: '90%', color: 'text.secondary',
                                            whiteSpace: 'break-spaces', mx: 'auto', textAlign: 'center'
                                        }}>
                                        {/* {item.details} */}
                                    </Typography>}

                                    <IconButton href={item.link} target='_blank' sx={{
                                        backgroundColor: 'secondary.main',
                                        color: 'primary.main',
                                        mt: 2, ":hover": { backgroundColor: 'primary.main', color: 'white' }
                                    }}>
                                        <ArrowRight sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>
                                : item?.type === 'external'
                                    ? <Box component={'a'} target='_blank' href={item?.link} sx={{
                                        borderRadius: '16px', maxWidth: '65%', mx: 'auto', border: '1px solid #1414171A',
                                        boxShadow: '0px 8px 16px 0px #0000000F',
                                        py: 2, backgroundColor: 'inherit', mx: 2, display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', px: 5, textDecoration: 'none',
                                        ":hover": { backgroundColor: '#0000000F' }
                                    }}>
                                        {item?.logo && <img src={item?.logo} style={{ width: '30px', height: 'auto' }} />}
                                        {/*  <YoutubeRed style={{ width: '30px', height: 'auto' }} /> */}

                                        <Typography sx={{
                                            color: '#0E60BF', fontSize: 13, minWidth: 'max-content',
                                            display: 'flex', mt: 1, fontWeight: 700,
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {item?.title} <ArrowRight sx={{ ml: 1, fontSize: 16 }} />
                                        </Typography>
                                    </Box>
                                    : <Box component={'a'} target='_blank' href={item?.link} sx={{
                                        borderRadius: '16px', width: '200px', mx: 'auto', border: '1px solid #1414171A',
                                        boxShadow: '0px 8px 16px 0px #0000000F',
                                        py: 2, backgroundColor: 'inherit', mx: 2, display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', px: 5, textDecoration: 'none',
                                        ":hover": { backgroundColor: '#0000000F' },
                                        backgroundImage: `url(${item?.logo})`,
                                        backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                                    }}>
                                    </Box>
                        })}
                    </Box>
                </Box>
            </Box>

            {/* Edit button */}
            {!preview && <Box sx={{ position: { xs: 'relative', lg: 'fixed' }, mb: 2, right: { lg: 30 }, }}>
                <EditButton url={editUrl} />
            </Box>}
        </Box>
        : <Box sx={{ display: 'flex', alignItems: 'center', py: 6, justifyContent: 'center', width: '100%' }}>
            <Loader />
        </Box>)
}