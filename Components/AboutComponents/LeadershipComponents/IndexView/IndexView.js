import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import { getRequestHandler } from "@/Components/requestHandler";
import { ChildrenSvgDyn, EmailSvg, MenSvgDyn, NoteSvgDyn, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import generateFileUrl from "@/utils/getImageUrl";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Heading from "../../Heading";
import AboutTabHead from "@/Components/TabHeads/aboutTabHead";
import Loader from "@/Components/Loader/Loader";

export default function IndexView({ editUrl, preview, previewPayload }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);

    const router = useRouter()

    const aboutSample = `Lorem ipsum dolor sit amet consectetur. Arcu dictum sapien amet et tristique vitae gravida sed imperdiet. Arcu porta porttitor sit fringilla. Nisi arcu ac rhoncus viverra vitae sed aliquam porta. Etiam imperdiet est ac volutpat mauris. Tellus amet scelerisque erat posuere amet tincidunt. Augue morbi et magna tellus. Convallis in luctus pulvinar velit. In aliquet in sodales curabitur. Sapien egestas quam euismod augue. Consequat felis morbi nibh eu at diam. Nam pellentesque integer amet nisi.`


    const sampleData = {
        banner: '/images/ministry.png', heroText: 'ABOUT  CALVARY CHAPEL TURKU', heroSubtitle: '',
        leaders: [
            { name: 'Robert Pecoraro', email: 'robertpecoraro@calvarychapel.fi', role: 'Pastor', image: '/images/robert.png', about: aboutSample },
            { name: 'Kyle Bentz', email: 'Kylebentz@calvarychapel.fi', role: 'Elder', image: '/images/kyle.png', about: aboutSample },
            { name: 'Jaakko Haapanen', email: 'JaakkoHaapanen@calvarychapel.fi', role: 'Elder', image: '/images/jaako.png', about: aboutSample },
            { name: 'Olli Förbom', email: 'accounting@calvarychapel.fi', role: 'Board Member', image: '/images/olli.png', about: aboutSample },
        ]
    }


    const leaders = [
        { name: 'Robert Pecoraro', email: 'robertpecoraro@calvarychapel.fi', role: 'Pastor', image: '/images/robert.png', about: aboutSample },
        { name: 'Kyle Bentz', email: 'Kylebentz@calvarychapel.fi', role: 'Elder', image: '/images/kyle.png', about: aboutSample },
        { name: 'Jaakko Haapanen', email: 'JaakkoHaapanen@calvarychapel.fi', role: 'Elder', image: '/images/jaako.png', about: aboutSample },
        { name: 'Olli Förbom', email: 'accounting@calvarychapel.fi', role: 'Board Member', image: '/images/olli.png', about: aboutSample },
    ]

    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(previewPayload);
        }
        else {
            //  setData({ banner: '/images/about.png', heroText: 'ABOUT CALVARY CHAPEL TURKU', heroSubtitle: '', leaders })
            //Get content
            getRequestHandler({
                route: `/api/leadership`,
                successCallback: body => {
                    const result = body?.result;
                    console.log('result from leadership', result);

                    if (result) {
                        setData({
                            ...body?.result,
                            banner: generateFileUrl(body?.result?.banner),
                            leaders: body?.result?.leaders?.map(item => {
                                return { ...item, image: item?.image && generateFileUrl(item?.image) }
                            })
                        })
                        setNoData(false)
                    }
                    else {
                        setData(sampleData)
                        // setNoData(true)
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

    return (data ?
        <Box sx={{
            display: 'flex', alignItems: { xs: 'center', lg: 'center' },
            flexDirection: { xs: 'column-reverse', lg: 'column' }, overflow: preview ? 'auto' : 'inherit',
            maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            pb: { xs: 1, md: 2, lg: 3 }, justifyContent: 'center',
        }}>
            {!preview && <AboutTabHead currentTabId={'leadership'} />}

            {/* View */}
            <Box sx={{
                border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
                borderRadius: '24px', overflow:/*  preview ? 'auto' :  */'hidden',
                width: preview ? '98%' : { xs: '95%', lg: '80%' }, mx: 'auto', overflow: preview ? 'auto' : 'inherit',
                px: preview ? 1 : 0, pt: preview ? 2 : 0, maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            }}>
                {/* Banner */}
                <Banner image={data?.banner} title={data?.heroText} subtitle={data?.heroSubtitle} />

                <Box>
                    {data?.leaders.map((item, index) => {
                        return <Box sx={{
                            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                            border: '3px solid #E6F1FF', alignItems: 'flex-start',
                            mx: 'auto', my: { xs: 4, md: 6 }, mx: { xs: 2, md: 4 }, borderRadius: '16px',
                            boxShadow: '0px 8px 16px 0px #0000000F', py: { xs: 2, md: 4 }, px: { xs: 2, md: 2, }
                        }}>
                            {/* Picture */}
                            <Box sx={{
                                minWidth: { xs: '90vw', sm: '150px' }, maxWidth: { xs: '90vw', sm: '150px' },
                                position: 'relative', mr: 6, height: 'auto'
                            }}>
                                <img src={item.image} style={{ margin: '0 20px', height: '100%', width: '100%' }} />
                            </Box>

                            <Box sx={{ mt: { xs: 2, md: 0 } }}>
                                <Typography sx={{
                                    fontSize: 14, fontWeight: 700, mb: 1,
                                    display: 'flex', alignItems: 'center', color: 'text.secondary'
                                }}>
                                    {item.name}
                                    <Typography style={{
                                        fontSize: 11, fontWeight: 600, padding: '2px 8px', marginLeft: '12px',
                                        color: '#0E60BF', backgroundColor: '#E8F2FF', borderRadius: '12px',
                                        textTransform: 'capitalize', maxWidth: 'max-content'
                                    }}>
                                        {item.role}
                                    </Typography>
                                </Typography>

                                <Box sx={{
                                    mb: 2, color: 'text.secondary',
                                    display: 'flex', alignItems: 'center'
                                }}>
                                    <EmailSvg style={{ marginRight: '20px', height: '15px', width: '30px' }} />
                                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                        {item.email}
                                    </Typography>

                                </Box>

                                <Typography sx={{
                                    fontSize: 13, color: 'text.secondary', backgroundColor: '#2828281A', mb: 1, maxWidth: 'max-content',
                                    fontWeight: 600, px: 1, py: .5, borderRadius: '12px'
                                }}>
                                    About me
                                </Typography>

                                <Typography
                                    dangerouslySetInnerHTML={{ __html: item?.about }}
                                    sx={{ fontSize: 14, fontWeight: 500, color: 'text.secondary', }}>
                                </Typography>
                            </Box>
                        </Box>
                    })}

                </Box>
            </Box>

            {/* Edit button */}
            {!preview && <Box sx={{ position: { xs: 'relative', lg: 'fixed' }, mb: 2, top: 200, right: { lg: 30 }, }}>
                <EditButton url={editUrl} />
            </Box>}
        </Box>
        : <Box sx={{ display: 'flex', alignItems: 'center', py: 6, justifyContent: 'center', width: '100%' }}>
            <Loader />
        </Box>)
}