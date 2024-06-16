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
import { Avatar, Box, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import FieldValue from "../../FieldValue/FieldValue";
import DataItem from "./DataItem";
import ServiceRenderer from "@/Components/Table/ServiceRenderer";
import Unpublish from "@/Components/BackButtonActions/Unpublish";
import Delete from "@/Components/BackButtonActions/Delete";
import Publish from "@/Components/BackButtonActions/Publish";
import Edit from "@/Components/BackButtonActions/Edit";
import Cancel from "@/Components/BackButtonActions/Cancel";

export default function SingleView({ editUrl, submitEndpoint, returnUrl }) {
    const router = useRouter();

    const params = useSearchParams();

    const id = params.get('id');
    const published = params.get('published');
    const cancelled = params.get('cancelled');

    const [data, setData] = useState(null)

    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        getRequestHandler({
            route: `/api/schedule-view?id=${id}`,
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
        justConcluded: { color: '#800080', label: 'Just Concluded' },
        concluded: { color: '#0E60BF', label: 'Concluded' },
        now: { color: '#FF9843', label: 'Happening Now' },
    }


    const allowModification = ['published', 'unpublished', 'cancelled', 'now']


    return <Box sx={{ width: '100%' }}>
        <BackButton title={'View Schedule'} components={
            [
                allowModification.includes(data?.status) && <Edit url={`${editUrl}?id=${id}`} />,
                <Delete
                    returnUrl={`/admin/schedule`}
                    id={id}
                    title={'Schedule'}
                    deleteEndpoint={'/api/delete-schedule'}
                />,
                allowModification.includes(data?.status) && (published == 'true'
                    ? <Unpublish title={'Schedule'}
                        returnUrl={`/admin/schedule`}
                        id={id} unpublishEndpoint={'/api/unpublish-schedule'}
                    /> :
                    <Publish title={'Schedule'}
                        returnUrl={`/admin/schedule`}
                        id={id} publishEndpoint={'/api/publish-schedule'}
                    />),
                allowModification.includes(data?.status) && data?.status !== 'cancelled' && <Cancel title={'Schedule'}
                    returnUrl={`/admin/schedule`}
                    id={id} cancelEndpoint={'/api/cancel-schedule'}
                />
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

                    {/* Status */}
                    <DataItem label={'Status'} flex={true} fullWidth={false}
                        value={statusData[data?.status]?.label}
                        color={statusData[data?.status]?.color}
                    />
                </Box>

                <Box sx={{ width: '100%', }}>
                    {/* Title */}
                    <DataItem label={'Title'} value={data?.title} />

                    {/* Details */}
                    <DataItem label={'Details'} value={data?.details} />

                    {/* Location */}
                    <DataItem label={'Location'} value={data?.location || '----'} />

                </Box>
                {/* Service, time, duration, speaker */}
                <Box sx={{
                    display: 'flex', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap',
                }}>
                    {/* Service */}
                    <DataItem fullWidth={false} label={'Service'} value={<ServiceRenderer value={data?.serviceType} />} />

                    {/* Time */}
                    <DataItem fullWidth={false} label={'Time'} value={data?.time} />

                    {/* Duration */}
                    <DataItem fullWidth={false} label={'Duration'} value={data?.duration} />

                    {/* Live Link */}
                    <DataItem fullWidth={false} label={'Live Link'} value={data?.liveLink || '------'} />

                    {/* Speaker */}
                    <DataItem fullWidth={false} label={'Speaker'} value={data?.speaker?.name} image={data?.speaker?.image} />

                    {/* Bible Characters */}
                    <DataItem fullWidth={false} label={'Bible Characters'} value={data?.isThereCharacterStudies ? data?.bibleCharacters?.join(', ') : '------'} />

                    {/* Topical Studies */}
                    <DataItem fullWidth={false} label={'Topical Studies'} value={data?.isThereTopicalStudies ? data?.topicalStudies?.join(', ') : '------'} />
                </Box>


            </Box> : <Loader />
        }
    </Box >
}