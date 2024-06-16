import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import { getRequestHandler } from "@/Components/requestHandler";
import generateFileUrl from "@/utils/getImageUrl";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContactComponent from "../Contact";
import MyComponent from "@/Components/Map";
import Loader from "@/Components/Loader/Loader";

export default function IndexView({ editUrl, preview, previewPayload }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);


    const router = useRouter()

    const sampleData = {
        banner: '/images/ministry.png', heroText: 'Contact Us', heroSubtitle: 'Calvary Chapel Turku gathers in Luolavuori multiple times a week, please find more information below',
        address: 'Takamaantie 1520720 Turku',
        addressLink: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2047.3438091069563!2d7.434218762423025!3d9.063205061040465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e752535045a6d%3A0x1ed6d853ab717f44!2sPCRC%20National%20Secretariat!5e0!3m2!1sen!2sng!4v1703597552591!5m2!1sen!2sng`,
        topics: ['topic 1', 'topic 2', 'topic 3'],
    }

    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(previewPayload);
        }
        else {
            //Get content
            getRequestHandler({
                route: `/api/contact-form`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {
                        setData({
                            ...body?.result,
                            banner: generateFileUrl(body?.result?.banner),
                        })
                        setNoData(false)
                    }
                    else {
                        setData([])
                        // setNoData(true)
                    }
                },
                errorCallback: err => {
                    setNoData(true);
                    setData([])
                    console.log('Something went wrong')
                }
            })
        }
    }, [])

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
                <Box sx={{
                    display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'stretch' },
                }}>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        border: '3px solid #E6F1FF',
                        maxWidth: { xs: '100%', md: '40%', lg: '50%' }, mx: 'auto', my: { xs: 4, md: 6 }, borderRadius: '16px',
                        boxShadow: '0px 8px 16px 0px #0000000F',
                        justifyContent: 'flex-start', px: { xs: 2, md: 1, lg: 1 }, py: 2
                    }}>
                        <Typography sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 600, color: 'primary.main', mb: 2 }}>
                            Church Address:
                        </Typography>

                        <Typography sx={{
                            maxWidth: 'max-content', px: 3, py: 1, fontSize: { xs: 14, md: 14 }, borderRadius: '12px',
                            fontWeight: 500, color: 'text.secondary', backgroundColor: 'secondary.main', mb: 4
                        }}>
                            {data?.address}
                        </Typography>

                        <Box sx={{
                            width: { xs: '70vw', md: '30vw' }, height: { xs: '70vw', md: '30vw' },
                            mt: { xs: 2, md: 0 }, mx: { xs: 'auto' }
                        }}>
                            <MyComponent coordinate={data?.coordinate} />
                            {/*  <iframe src={data?.addressLink}
                                width="100%" height="100%"
                                style={{ border: 'none' }} allowfullscreen=""
                                loading="lazy" referrerpolicy="no-referrer-when-downgrade">

                            </iframe> */}
                        </Box>
                    </Box>

                    {data && <ContactComponent topics={data?.topics} disabled={true}
                        details={data?.details} maxWidth={{ xs: '80%', md: '40%' }}
                    />}
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