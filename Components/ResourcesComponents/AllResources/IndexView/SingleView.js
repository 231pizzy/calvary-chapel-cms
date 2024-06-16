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
import FieldValue from "@/Components/FieldValue/FieldValue";
import DataItem from "./DataItem";
import ServiceRenderer from "@/Components/Table/ServiceRenderer";
import UrlRenderer from "@/Components/Table/UrlRenderer";
import { DownloadSvg, EditBoxSvg, PdfSvg } from "@/public/icons/icons";
import Edit from "@/Components/BackButtonActions/Edit";
import Delete from "@/Components/BackButtonActions/Delete";
import Publish from "@/Components/BackButtonActions/Publish";
import Unpublish from "@/Components/BackButtonActions/Unpublish";

export default function SingleView({ editUrl, submitEndpoint, returnUrl }) {
    const router = useRouter();

    const params = useSearchParams();

    const id = params.get('id');
    const published = params.get('published');

    const [data, setData] = useState(null)

    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        getRequestHandler({
            route: `/api/resource-view?id=${id}`,
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
    }



    return <Box sx={{ width: '100%' }}>
        <BackButton title={'View Resource'} components={
            [
                <Edit url={`${editUrl}?id=${id}`} />,
                <Delete title={'Resource'}
                    returnUrl={`/admin/resources/all-resources`}
                    id={id}
                    deleteEndpoint={'/api/delete-resource'}
                />,
                published == 'true' ? <Unpublish title={'Resource'}
                    returnUrl={`/admin/resources/all-resources`}
                    id={id} unpublishEndpoint={'/api/unpublish-resource'}
                /> :
                    <Publish title={'Resource'}
                        returnUrl={`/admin/resources/all-resources`}
                        id={id} publishEndpoint={'/api/publish-resource'}
                    />,
            ]
        } />

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

                {/* Title */}
                <DataItem label={'Resource Title'} value={data?.title} />

                {/* Scripture, time, speaker */}
                <Box sx={{
                    display: 'flex', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap',
                }}>
                    {/* Scripture */}
                    <DataItem fullWidth={false} label={'Scripture'} capitalize={true} value={data?.scripture} />

                    {/* Service */}
                    <DataItem fullWidth={false} label={'Service'} value={<ServiceRenderer value={data?.serviceType} />} />

                    {/* Speaker */}
                    <DataItem fullWidth={false} label={'Speaker'} value={data?.speaker?.name} image={data?.speaker?.image} />

                    {/* Video Resource */}
                    <DataItem fullWidth={false} label={'Video Resource'} value={<UrlRenderer value={data?.video} />} />

                    {/* Audio Resource */}
                    <DataItem fullWidth={false} label={'Audio Resource'} value={<UrlRenderer value={data?.audio} />} />

                    {/* Audio Download */}
                    <DataItem fullWidth={false} label={'Audio Download'} iconLeft={<DownloadSvg />} value={<UrlRenderer url={data?.audioDownload} value={'Click to download'} />} />

                    {/* Document Download */}
                    <DataItem fullWidth={false} label={'Document Download'} iconLeft={<PdfSvg />} value={<UrlRenderer url={data?.documentDownload} value={'Click to download'} />} />

                    {/* Bible Characters */}
                    <DataItem fullWidth={false} label={'Bible Characters'} value={data?.isThereCharacterStudies ? data?.bibleCharacters?.join(', ') : '------'} />

                    {/* Topical Studies */}
                    <DataItem fullWidth={false} label={'Topical Studies'} value={data?.isThereTopicalStudies ? data?.topicalStudies?.join(', ') : '------'} />
                </Box>


            </Box> : <Loader />
        }
    </Box >
}