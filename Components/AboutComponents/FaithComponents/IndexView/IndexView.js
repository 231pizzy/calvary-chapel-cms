import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import { getRequestHandler } from "@/Components/requestHandler";
import { ChildrenSvgDyn, CrossSvg, FaithSvgDyn, MenSvgDyn, NoteSvgDyn, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
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
        bodyTitle: 'WHAT WE BELIEVE',
        bodyImage: '/images/we-believe.png', sections: [
            {
                title: 'Bible', believe: true, beliefs: `in the inerrancy of Scripture: That the Bible, Old and New Testaments, in the original autographs, is the inspired, infallible Word of God, a complete and final written revelation of God. We reject doctrinal viewpoints or spiritual phenomena which find their basis for practice in the church solely on experience. We look to the Word of God for the basis of all our faith and practice.
                    in the full historicity of the biblical record of primeval history, including the creation of the heavens and the earth in six literal days, the literal existence of Adam and Eve as the progenitors of all people, the literal fall in the Garden of Eden and resultant divine curse on creation, the worldwide cataclysmic deluge, and the origin of the nations and languages at the tower of Babel.`
            },
            {
                title: 'God', believe: true, beliefs: `in one personal, Triune God, who manifests Himself in three separate persons: Father, Son and Holy Spirit. He is essentially Spirit, the creator of all, who is eternal, almighty, transcendent, sovereign, life, love, truth, wise, just, holy, pure, unchangeable and infallible in all things, yet relational and personal.`
            },
            {
                title: 'Jesus', believe: true, beliefs: `that Jesus Christ is fully God and fully human, possessing two distinct natures which are co-joined in one person; that He was miraculously conceived by the Holy Spirit, born of the virgin Mary, lived a sinless and miraculous life, provided for the atonement of our sins by His vicarious substitutionary death on the Cross, was physically resurrected by the power of the Holy Spirit and physically ascended to the right hand of God the Father in heaven. Who after His ascension, poured out His Holy Spirit on the believers in Jerusalem, enabling them to fulfill His command to preach the Gospel to the entire world; an empowerment and obligation all believers since have shared in. One day Jesus will return in similar manner as He ascended (Acts 1:11; Matt 24:30).`
            },
            {
                title: 'The Holy Spirit', believe: true, beliefs: `the Holy Spirit is the third person of the Godhead, thus He is a personal being not an impersonal force. He seals, indwells, sanctifies, baptizes, teaches, empowers, reveals, and guides the believer into all truth. The Holy Spirit gives gifts to whom He wills, which are valid for today, and ought to be exercised within scriptural guidelines. We as believers are to earnestly desire the best gifts, seeking to exercise them in love that the whole Body of Christ might be edified. We believe that love is more important than the most spectacular gifts, and without this love all exercise of spiritual gifts is worthless.`
            },
            {
                title: 'Man/Sin', believe: true, beliefs: `that all people are by nature separated from God and are responsible for their own sin, but that salvation, redemption, and forgiveness are freely offered to all by the grace of our Lord Jesus Christ. When a person repents of their sin and places their faith in Jesus Christ as the Savior and Lord, trusting Him to save and submitting to His Lordship, that person is immediately born again and sealed by the Holy Spirit, all his/her sins are forgiven, and that person becomes a child of God`
            },
            {
                title: 'Salvation', beliefs: `Salvation is initiated, attained, and procured by God through the death of Christ on the cross for our sins and His resurrection from the dead. The salvation Christ offers is available to all, and is received freely by grace alone and through faith in Christ alone, apart from good works, thereby justifying, sanctifying and eventually glorifying the believer`
            },
            {
                title: 'Church', beliefs: `The universal Church is an organic body composed of all believers, both living and dead, who have been sealed by the Holy Spirit through faith in Jesus Christ for salvation. The church has the responsibility to worship the Lord and share the good news of Christ’s death and resurrection to the world, making disciples, baptizing believers, and teaching them to observe sound doctrine and live a morally pure life. We believe church government should be simple rather than a complex bureaucracy, with the utmost dependence upon the Holy Spirit to lead, rather than on fleshly promotion or worldly wisdom. The Lord has given the church two ordinances which are to continue until He returns — believers baptism by immersion and Holy Communion. Water baptism is not necessary for salvation, and cannot remove sins, but is a picture of the salvation already received by the believer. We believe the only true basis of Christian fellowship is Christ’s sacrificial agape love, which is greater than any secondary differences we possess, and without which we have no right to claim ourselves Christians.`
            },
            {
                title: 'End Times', beliefs: `We await the pre-tribulational rapture of the church, and we believe that at the Second Coming of Christ He will visibly set up his throne on earth and personally rule with His saints for 1000 years. This motivates us to holy living, heartfelt worship, committed service, diligent study of God’s Word, regular fellowship, and participation in baptism by immersion and in Holy Communion. We believe that the nation of Israel still has a special place in God’s plan and that all the promises of the God of Israel will be fulfilled`
            },
        ],
    }

    const processResult = (result) => {
        const sections = []

        //Get all the sections keys
        const sectionKeyArray = [];

        Object.keys(result).forEach(i => {
            if (i?.includes('-spliter-')) {
                const key = i?.split('-spliter-')[0]

                if (sectionKeyArray.includes(key)) return false

                const title = result[`${key}-spliter-title`] //Get the title
                const beliefs = result[`${key}-spliter-description`] //Get the belief/description

                sections.push({ title, beliefs }) //Save it

                sectionKeyArray.push(key) //Note the key so as to skip it in any other iterations it is found
            }
        });

        return { ...result, sections }
    }

    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(processResult(previewPayload));
        }
        else {
            //  setData(sampleData)
            //Get content
            getRequestHandler({
                route: `/api/faith`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {

                        setData({
                            ...body?.result,
                            banner: generateFileUrl(body?.result?.banner),
                            bodyImage: generateFileUrl(body?.result?.bodyImage),
                            ...processResult(body?.result?.sections)
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
            {!preview && <AboutTabHead currentTabId={'faith'} />}
            {/* View */}
            <Box sx={{
                border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
                borderRadius: '24px',
                width: preview ? '98%' : { xs: '95%', lg: '80%' }, mx: 'auto', overflow: preview ? 'auto' : 'inherit',
                px: preview ? 1 : 0, pt: preview ? 2 : 0, maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            }}>
                {/* Banner */}
                <Banner image={data?.banner} title={data?.heroText} subtitle={data?.heroSubtitle} />

                <Box sx={{
                    px: 4, py: 4, mt: 4, backgroundImage: `url(${data?.bodyImage})`, backgroundSize: '100% 100%',
                    position: 'relative', backgroundRepeat: 'no-repeat'
                }}>
                    <div style={{
                        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 0,
                        backgroundColor: '#052F61BF', opacity: '90%'
                    }}> </div>

                    <Heading icon={<FaithSvgDyn style={{ height: '28px', width: '28px' }} />} title={data?.bodyTitle} color='white' />

                    <Box sx={{ mt: 4 }}>
                        {data?.sections?.map((item, index) => {
                            return <Box key={index} sx={{
                                backgroundColor: 'background.default', px: 2, pt: 2,
                                opacity: '90%', borderRadius: '16px', mb: 4,
                            }}>
                                <Heading icon={<CrossSvg style={{ height: '23px', width: '23px' }} />} uppercase={true}
                                    title={item.title} color='primary.main' />

                                <Typography
                                    dangerouslySetInnerHTML={{ __html: item?.beliefs }}
                                    sx={{
                                        color: 'text.secondary', whiteSpace: 'pre-wrap', pb: 1.5,
                                        fontSize: 16, lineHeight: '24px'
                                    }}>
                                </Typography>
                            </Box>
                        })}
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