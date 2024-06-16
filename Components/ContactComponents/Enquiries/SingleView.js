'use client'

import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import BackButton from "@/Components/BackButton/BackButton";
import Loader from "@/Components/Loader/Loader";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import EditButton from "@/Components/EditButton/EditButton";
import FormTextField from "@/Components/TextField/TextField";
import { getRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import generateFileUrl from "@/utils/getImageUrl";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import FieldValue from "@/Components/FieldValue/FieldValue";
import DataItem from "./DataItem";
import ServiceRenderer from "@/Components/Table/ServiceRenderer";
import UrlRenderer from "@/Components/Table/UrlRenderer";
import { DownloadSvg, PdfSvg, ReplySvg } from "@/public/icons/icons";
import MarkAsUnread from "@/Components/BackButtonActions/MarkAsUnread";
import MarkAsRead from "@/Components/BackButtonActions/MarkAsRead";
import Delete from "@/Components/BackButtonActions/Delete";

export default function SingleView({ editUrl, replyUrl, submitEndpoint, returnUrl }) {
    const router = useRouter();

    const params = useSearchParams();

    const id = params.get('id');
    const read = params.get('read');

    const [data, setData] = useState(null)

    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        getRequestHandler({
            route: `/api/message-view?id=${id}`,
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

    const statusData = {
        published: { color: '#008000', label: 'Published' },
        unpublished: { color: '#FF0000', label: 'Unpublished' },
        cancelled: { color: '#8A2424', label: 'Cancelled' },
        unread: { color: '#FFA500', label: 'Unread' },
        read: { color: '#9034D8', label: 'Read' },
        replied: { color: '#008000', label: 'Replied' },
    }


    return <Box sx={{ width: '100%' }}>
        <BackButton title={'View Enquiry'} components={
            [
                <Delete
                    returnUrl={`/admin/contact`}
                    id={id}
                    title={'Enquiry'}
                    deleteEndpoint={'/api/delete-message'}
                />,
                data?.status && data?.status != 'replied' && (<MarkAsUnread title={'Enquiry'}
                    returnUrl={`/admin/contact`}
                    id={id} markAsUnreadEndpoint={'/api/mark-as-unread'}
                />),
                data?.status && data?.status != 'replied' && <Button href={`${replyUrl}?id=${id}`} variant={'contained'}
                    sx={{
                        borderRadius: '8px', bgcolor: '#0E60BF', color: 'white',
                        fontSize: '12px', px: 1, py: .5
                    }}>
                    <ReplySvg style={{ marginRight: '8px', color: 'white' }} />
                    Reply
                </Button>
            ]
        }
        />

        {showForm ?
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', px: 2, py: 2, my: 4,
                border: '1px solid #1414171A', borderRadius: '16px', boxShadow: '0px 8px 16px 0px #0000000F'
            }}>
                {/* Date and status */}
                <Box sx={{ display: 'flex', width: '100%', p: 0, m: 0, alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Date */}
                    <DataItem label={'Date'} flex={true} value={data?.date} fullWidth={false} />

                    <DataItem label={'Time'} flex={true} value={data?.time} fullWidth={false} />

                    {/* Status */}
                    <DataItem label={'Status'} flex={true} fullWidth={false}
                        value={statusData[data?.status]?.label}
                        color={statusData[data?.status]?.color}
                    />
                </Box>

                {/* Name */}
                <DataItem label={'Name'} flex={true} value={data?.name} capitalize={true} />

                {/* Email */}
                <DataItem label={'Email'} flex={true} value={data?.email} />

                {/* Topic */}
                <DataItem label={'Topic'} flex={true} value={data?.topic} />

                {/* Details */}
                <DataItem label={'Details'} value={data?.message} />

                {/* Reply */}
                {data?.status === 'replied' && <DataItem label={`Reply by ${data?.repliedBy}`} value={data?.reply} />}

            </Box> : <Loader />
        }
    </Box >
}