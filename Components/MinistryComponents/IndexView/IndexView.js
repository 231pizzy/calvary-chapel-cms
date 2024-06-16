import BackButton from "@/Components/BackButton/BackButton";
import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import Loader from "@/Components/Loader/Loader";
import MinistryTabHead from "@/Components/TabHeads/MinistryTabHead";
import { getRequestHandler } from "@/Components/requestHandler";
import { ChildrenSvgDyn, MenSvgDyn, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import generateFileUrl from "@/utils/getImageUrl";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IndexView({ ministry = 'men-service', editUrl, preview,
    banner, bodyImage, heroText, heroSubtitle, bodyTitle, bodyDetails }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);

    const router = useRouter()

    const iconStyle2 = { height: '25px', width: '25px', marginRight: '12px' };

    const samplWriteUp = `Lorem ipsum dolor sit amet consectetur. Congue urna fusce quis hendrerit molestie. Consequat vitae id dolor adipiscing aenean lacinia. Lobortis lacus purus sed in dolor sit. Cras cursus at pharetra varius. Donec aenean eget enim amet massa felis maecenas tristique lacinia. Vulputate arcu vestibulum et vel. Cursus ut diam aliquet tristique nibh aliquam aliquam. Sagittis mauris mauris leo elit eu urna id justo rutrum. Arcu vitae laoreet tortor ultrices vitae iaculis vitae urna vitae. Mauris suscipit quis ac gravida maecenas id. Pellentesque pulvinar hendrerit nunc id ut. Gravida vitae at risus purus adipiscing suspendisse velit.
    Mi leo consectetur gravida parturient. Ultrices sem tincidunt vitae nulla auctor mattis urna dui. Aliquam aliquet at morbi sagittis vitae praesent condimentum. Placerat pellentesque tellus imperdiet in sapien pulvinar. Quam urna amet mi tellus blandit. Iaculis vel sed amet proin non iaculis habitant. Magna vestibulum enim aenean pharetra dignissim tincidunt diam. Morbi auctor tristique faucibus enim ac elementum id ornare potenti. Rhoncus id vehicula ultrices tellus amet nunc.
    Orci lacus eget sem commodo ultricies viverra porttitor. Dictumst ac enim phasellus sed tincidunt nam donec euismod. Vel posuere nulla ac scelerisque ut pretium iaculis.`

    const serviceTypes = {
        'men-service': {
            label: "Men's Ministry", content: samplWriteUp, image: '/images/men-ministry.png', value: 'men-service',
            icon: <MenSvgDyn style={iconStyle2} />, banner: '/images/ministry.png', title: 'Our Ministry',
            subtitle: ''
        },
        'women-service': {
            label: "Women's Ministry", content: samplWriteUp, image: '/images/women-ministry.png', value: 'women-service',
            icon: <WomenSvgDyn style={iconStyle2} />, banner: '/images/ministry.png', title: 'Our Ministry',
            subtitle: ''
        },
        'youth-service': {
            label: "Youth Ministry", content: samplWriteUp, image: '/images/youth-ministry.png', value: 'youth-service',
            icon: <YouthSvgDyn style={iconStyle2} />, banner: '/images/ministry.png', title: 'Our Ministry',
            subtitle: ''
        },
        'children-service': {
            label: "Children's Ministry", content: samplWriteUp, image: '/images/children-ministry.png', value: 'children-service',
            icon: <ChildrenSvgDyn style={iconStyle2} />, banner: '/images/ministry.png', title: 'Our Ministry',
            subtitle: ''
        }
    }


    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', { bodyTitle, bodyDetails, bodyImage, banner, heroText })
            bodyTitle && bodyDetails && bodyImage && banner && heroText && setData({
                bodyTitle, bodyDetails, bodyImage,
                banner, heroText, heroSubtitle
            });
        }
        else {
            //Get content
            getRequestHandler({
                route: `/api/ministry/?ministry=${ministry}`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {
                        setData({
                            ...body?.result,
                            banner: generateFileUrl(body?.result?.banner),
                            bodyImage: generateFileUrl(body?.result?.bodyImage)
                        })
                        setNoData(false)
                    }
                    else {
                        setData({})
                        setNoData(true)
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

    return data ?
        <Box sx={{
            display: 'flex', alignItems: { xs: 'center', lg: 'fcenter' },
            flexDirection: { xs: 'column-reverse', lg: 'column' }, overflow: preview ? 'auto' : 'inherit',
            maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            pb: { xs: 1, md: 2, lg: 3 }, justifyContent: 'flex-start',
        }}>

            {!preview && <MinistryTabHead currentTabId={ministry} />}
            {/* View */}
            {noData ?
                <Typography sx={{ textAlign: 'center' }}>
                    There is no data for this page. Kindly use the edit button to add data
                </Typography>
                : <Box sx={{ width: preview ? '98%' : { xs: '95%', lg: '80%' }, }}>

                    <Box sx={{
                        border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
                        borderRadius: '24px', overflow:/*  preview ? 'auto' :  */'hidden',
                       /*  width: preview ? '98%' : { xs: '95%', lg: '80%' }, */ mx: 'auto',
                        /* width: preview ? '98%' : 'auto', */ /* maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit' */
                    }}>
                        {/* Banner */}
                        <Banner image={data?.banner} title={data?.heroText} subtitle={data?.heroSubtitle} />

                        {/* Content */}
                        <Box sx={{
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' },
                            width: '100%', mb: 4, mt: 4,
                        }}>
                            <img src={data?.bodyImage} style={{ margin: '0 40px' }} />

                            <Box sx={{ mt: { xs: 2, md: 0 }, pr: { md: 1 } }}>
                                <Typography sx={{ fontSize: preview ? 16 : 24, textAlign: { xs: 'center', md: 'inherit' }, fontWeight: 600, color: 'primary.main', mb: 1 }}>
                                    {data?.bodyTitle}
                                </Typography>

                                <Typography dangerouslySetInnerHTML={{ __html: data?.bodyDetails }}
                                    sx={{ fontSize: preview ? 14 : 16, fontWeight: 400, color: 'text.secondary', lineHeight: '30px', }}>
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                </Box>}

            {/* Edit button */}
            {!preview && <Box sx={{ position: { xs: 'relative', lg: 'fixed' }, mb: 2, top: 200, right: { lg: 30 }, }}>
                <EditButton url={editUrl} />
            </Box>}
        </Box>

        : <Loader />
}