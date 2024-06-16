import { Box } from "@mui/material";
import ResourceTabHead from "../TabHeads/resourceTabHead";
import { useEffect, useState } from "react";
import { getRequestHandler } from "../requestHandler";
import Banner from "../Banner";
import EditButton from "../EditButton/EditButton";
import Loader from "../Loader/Loader";
import generateFileUrl from "@/utils/getImageUrl";

export default function HeroIndexView({ page, pageId, editUrl, preview, previewPayload }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(previewPayload);
        }
        else {
            //Get content
            getRequestHandler({
                route: `/api/hero?page=${pageId}`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {
                        setData({
                            ...result,
                            banner: generateFileUrl(result?.banner),
                        })
                    }
                    else {
                        setData({})
                    }
                },
                errorCallback: err => {
                    setData({})
                    console.log('Something went wrong', err)
                }
            })
        }
    }, [])

    console.log('data in hero', data);

    return <Box>
        {/* Heading */}
        {page === 'resource' && <ResourceTabHead currentTabId={pageId} />}

        {/* Content */}
        {data ? <Box sx={{
            border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
            borderRadius: '24px', overflow:/*  preview ? 'auto' :  */'hidden',
            width: preview ? '98%' : { xs: '95%', lg: '80%' }, mx: 'auto', mt: 3,
        }}>
            {/* Banner */}
            <Banner image={data?.banner} title={data?.heroText} subtitle={data?.heroSubtitle} />

            {/* Edit button */}
            {!preview && <Box sx={{
                position: { xs: 'relative', lg: 'fixed' }, mb: 2,
                top: page === 'resource' ? 200 : 100, right: { lg: 30 },
            }}>
                <EditButton url={editUrl} />
            </Box>}
        </Box> : <Loader />}
    </Box>
}