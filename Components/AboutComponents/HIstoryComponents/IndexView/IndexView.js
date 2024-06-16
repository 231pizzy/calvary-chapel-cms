import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import { getRequestHandler } from "@/Components/requestHandler";
import { ChildrenSvgDyn, MenSvgDyn, NoteSvgDyn, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
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

    const sampleData = {
        banner: '/images/ministry.png', heroText: 'ABOUT  CALVARY CHAPEL TURKU', heroSubtitle: '',
        section1Heading: 'About Us', section1Text: `Calvary Chapel has been formed as a fellowship of believers in the Lordship of Jesus Christ. Our supreme desire is to know Christ, to grow our faith in Him and ultimately be conformed to His image by the power of the Holy Spirit and the Word of God (Rom 8:29; John 17:17)

        As there is within the Word of God everything that is needed for life and godliness (2 Pe 1:3) it becomes evident that without ample, clear and thorough Bible teaching in the church, such desired growth as described above will not be reached. This is why in CCT we prioritize teaching through the Bible during our weekly services. Imagine the power that is present as the Holy Spirit works in us through the teaching of the Word of God (2 Tim 3:16-17; John 14:26). Come study His Word with us!
        .`, section1Image: `/images/about-2.jpg`, section2Heading: 'A Brief History of CCT',
        section2Text: `Calvary Chapel Turku began in 2005 in a small apartment in Varissuo Turku as a home Bible Study. Since then CCT has been steadily teaching through the Bible with two weekly services, one on Sunday and a midweek service on Wednesday evening. Since the time of those original Bible studies in Varissuo, CCT has relocated to Takamaantie 15 to accommodate the growing number of people and ministries within the church.`,
        section2Image: '/images/about-1.png', section3Heading: 'History Of Calvary Chapel',
        section3Text: `In 1965, Pastor Chuck Smith began his ministry at Calvary Chapel Costa Mesa with just 25 people. From the beginning, Pastor Chuck welcomed all, young and old, without judgment, placing his emphasis on the teaching of the Word of God. His simple, yet sound, biblical approach drew 25,000 people weekly.

        With a sincere concern for the lost, Pastor Chuck made room in his heart and his home for a generation of hippies and surfers, generating a movement of the Holy Spirit that spread from the West Coast to the East Coast, and now, throughout the world. What began as a small local church has now grown into an international ministry of over 1,800 fellowships throughout the world.
        
        Here in our website, we invite you to find out more about who we are today, what we believe, where we are throughout the world; and we invite you to join us as we meet and worship our wonderful Lord and Savior, study His Word, fellowship together, grow in His grace, and desire to make disciples and go into all the world. For a more in-depth look at the history of Calvary Chapel, we recommend reading The Reproducers. You can download a free digital copy as a PDF or ePub.`,
        section3Image: '/images/chapel-history.jpg'
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
                route: `/api/history`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {
                        setData({
                            ...body?.result,
                            banner: generateFileUrl(body?.result?.banner),
                            section1Image: generateFileUrl(body?.result?.section1Image),
                            section2Image: generateFileUrl(body?.result?.section2Image),
                            section3Image: generateFileUrl(body?.result?.section3Image)
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
            {!preview && <AboutTabHead currentTabId={'history'} />}
            {/* View */}
            <Box sx={{
                border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
                borderRadius: '24px', overflow:/*  preview ? 'auto' :  */'hidden',
                width: preview ? '98%' : { xs: '95%', lg: '80%' }, mx: 'auto',
                overflow: preview ? 'auto' : 'inherit', px: preview ? 1 : 0, pt: preview ? 2 : 0,
                maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            }}>
                {/* Banner */}
                <Banner image={data?.banner} title={data?.heroText} subtitle={data?.heroSubtitle} />

                {/* About section */}
                <Box sx={{ px: { xs: 2, md: 4 }, my: 4, }}>
                    <Heading icon={<NoteSvgDyn style={{ height: '23px', width: '23px' }} />} title={data?.section1Heading} color='primary.main' />

                    <Box sx={{
                        display: 'flex', alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' },
                        width: '100%', mb: 4, mt: 4, justifyContent: 'space-between'
                    }}>
                        <Box sx={{}}>
                            <Typography /* component={'div'}  */ sx={{
                                fontSize: 16, fontWeight: 400, maxWidth: { xs: '100%', md: '50vw' },
                                lineHeight: '30px', color: 'text.secondary', whiteSpace: 'pre-wrap'
                            }} dangerouslySetInnerHTML={{ __html: data?.section1Text }}>
                            </Typography>
                        </Box>


                        <Box sx={{
                            width: { xs: '70vw', lg: 'auto' }, height: { xs: 'auto', md: '300px' },
                            mt: { xs: 2, md: 0 }, mx: { xs: 'auto', md: 'inherit' }, ml: { xs: 'auto', md: '24px' }
                        }}>
                            <img src={data?.section1Image} style={{ margin: 'auto', height: '100%', width: '100%' }} />
                        </Box>
                    </Box>
                </Box>

                {/* Brief history section */}
                <Box sx={{
                    position: 'relative', backgroundImage: `url(${data?.section2Image})`, backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', maxHeight: 'max-content', py: 4, backgroundSize: '100% 100%'
                }}>
                    <div style={{
                        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 3,
                        backgroundColor: '#052F61BF', opacity: '90%'
                    }}> </div>

                    <Box sx={{
                        zIndex: 6, position: 'relative',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Heading icon={<NoteSvgDyn style={{ height: '23px', width: '23px' }} />} title={data?.section2Heading} color='white' />

                        <Typography sx={{
                            fontSize: { xs: 16, md: 18 }, fontWeight: 400, color: 'white', whiteSpace: 'break-spaces', textAlign: 'center',
                            maxWidth: { xs: '90%', md: '80%', lg: '80%' }, mx: 'auto', opacity: '80%', whiteSpace: 'pre-wrap'
                        }} dangerouslySetInnerHTML={{ __html: data?.section2Text }}>
                        </Typography>

                    </Box>
                </Box>

                {/* History of Calvary chapel */}
                <Box sx={{ px: { xs: 2, md: 4 }, mt: 4, maxWidth: '100%' }}>
                    <Heading icon={<NoteSvgDyn style={{ height: '23px', width: '23px' }} />}
                        title={data?.section3Heading} color='primary.main' />

                    <Box sx={{
                        display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' },
                        width: '100%', mb: 4, mt: 4, justifyContent: { md: 'space-between' },
                    }}>
                        <Box sx={{
                            width: { xs: '70vw', lg: 'auto' }, height: { xs: 'auto', lg: '400px' }, mt: { xs: 2, md: 1 },
                            mb: { xs: 2, md: 0 }, mx: { xs: 'auto' }, mr: { xs: 'auto', md: '24px', lg: 'auto' },
                        }}>
                            <img src={data?.section3Image} style={{ margin: 'auto', height: '100%', width: '100%' }} />
                        </Box>

                        <Box sx={{}}>
                            {/* <Typography sx={{ fontSize: 24, fontWeight: 600, color: 'text.primary', mb: { md: 1 } }}>
                                    Adopted from calvarycca.org
                                </Typography> */}

                            <Typography sx={{
                                fontSize: 16, fontWeight: 400, ml: 2, maxWidth: { xs: '100%', md: '50vw' },
                                lineHeight: '30px', color: 'text.secondary', whiteSpace: 'pre-wrap'
                            }} dangerouslySetInnerHTML={{ __html: data?.section3Text }}>
                            </Typography>
                        </Box>

                    </Box>
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