'use client'

import BackButton from "@/Components/BackButton/BackButton";
import Loader from "@/Components/Loader/Loader";
import EditButton from "@/Components/EditButton/EditButton";
import { getRequestHandler, } from "@/Components/requestHandler";
import { Box, } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataItem from "../ResourcesComponents/AllResources/IndexView/DataItem";
import Edit from "@/Components/BackButtonActions/Edit";
import Delete from "@/Components/BackButtonActions/Delete";

export default function SingleView({ editUrl, submitEndpoint, returnUrl }) {
    const router = useRouter();

    const params = useSearchParams();

    const id = params.get('id');

    const [data, setData] = useState(null)

    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        getRequestHandler({
            route: `/api/location-view?id=${id}`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setData({
                        ...result,
                    })

                    setTimeout(() => {
                        setShowForm(true)
                    }, 2000)
                }
                else {
                    setShowForm(true)
                }
            },
            errorCallback: err => {
                setShowForm(true)
                console.log('Something went wrong', err)
            }
        })
    }, [])

    return <Box sx={{ width: '100%' }}>
        <BackButton title={'View Location'} components={
            [
                <Edit url={`${editUrl}?id=${id}`} />,
                <Delete title={'Location'}
                    returnUrl={`/admin/location`}
                    id={id}
                    deleteEndpoint={'/api/delete-location'}
                />,
            ]
        }
        />

        {showForm ?
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', px: 2, py: 2, my: 4,
                border: '1px solid #1414171A', borderRadius: '16px', boxShadow: '0px 8px 16px 0px #0000000F'
            }}>
                {/* Title */}
                <DataItem label={'Title'} value={data?.title} />

                {/* Address */}
                <DataItem label={'Address'} value={data?.address} />
            </Box> : <Loader />
        }
    </Box >
}