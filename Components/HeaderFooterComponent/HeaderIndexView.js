import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import EditButton from "../EditButton/EditButton";
import { AboutSvg, ContactSvg, FacebookSvg, LocationSvg, MinistrySvg, PhoneSvg, ResourceSvg, ScheduleSvg, YoutubeSvg } from "@/public/icons/icons";
import { ArrowDropDown } from "@mui/icons-material";
import moment from "moment";
import { getRequestHandler } from "../requestHandler";
import { parseLink } from "./Preview";

export default function IndexView({ editUrl }) {
    const [data, setData] = useState(null);

    const sampleData = {
        header: {
            logo: '/images/sitelogo.svg', title: 'Calvary Chapel Turku'
        },
        footer: {
            logo: '/images/sitelogoWhite.svg', title: 'Calvary Chapel Turku', address: 'Takamaantie 15 20720 Turku',
            addressLink: '', phone: '+358 987 789 23', facebookLink: '', youtubeLink: ''
        }
    }

    useEffect(() => {
       // setData(sampleData);

       /*  false && */ getRequestHandler({
        route: `/api/header-footer`,
        successCallback: body => {
            const result = body?.result;
            if (result) {
                setData(body?.result)
            }
            else {
                setData({})
            }
        },
        errorCallback: err => {
            setData({})
            console.log('Something went wrong')
        }
    })
    }, [])

    const iconStyle = { height: '18px', width: '18px', marginRight: '4px' }
    const iconStyle2 = { height: '18px', width: '18px', marginRight: '4px' }
    const menuItems = [
        { label: 'Ministry', icon: <MinistrySvg style={iconStyle} />, hasChildren: true },
        { label: 'Resources', icon: <ResourceSvg style={iconStyle} />, hasChildren: true },
        { label: 'Schedule', icon: <ScheduleSvg style={iconStyle} />, hasChildren: false },
        { label: 'About CCT', icon: <AboutSvg style={iconStyle} />, hasChildren: true },
        { label: 'Contact', icon: <ContactSvg style={iconStyle} />, hasChildren: false },
    ]

    return data ? <Box>
        {/* Header */}
        <Box sx={{
            maxWidth: '80%', mx: 'auto', mt: 2, border: '1px solid #1414171A', borderRadius: '8px',
            display: 'flex', flexDirection: 'column', p: 2, bgcolor: '#F5F5F5'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                    Header
                </Typography>

                <EditButton url={`${editUrl}?type=header`} />
            </Box>

            <Box sx={{
                display: 'flex', alignItems: 'center', p: 1.5, border: '0.82px solid #1414170D',
                boxShadow: '0px 6.594444274902344px 13.188888549804688px 0px #0000000A', bgcolor: 'white',
                justifyContent: 'space-between', borderRadius: '8px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: 14, width: 17, minWidth: 'max-content' }}>
                    <img src={data?.header?.logo} style={{ height: '100%', width: '100%' }} />
                    <Typography sx={{ color: 'primary.main', minWidth: 'max-content', ml: 1, fontSize: 12 }}>
                        {data?.header?.title}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    {menuItems.map((item, index) => {
                        return <Typography key={index} sx={{
                            fontSize: 13, mr: 2, display: 'flex', alignItems: 'center',
                            fontWeight: 500
                        }}>
                            {item?.icon} {item?.label} {item?.hasChildren && <ArrowDropDown />}
                        </Typography>
                    })}
                </Box>
            </Box>
        </Box>

    </Box> : <Loader />
}