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
import { Form, Formik, useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import FieldValue from "@/Components/FieldValue/FieldValue";
import DataItem from "./DataItem";
import ServiceRenderer from "@/Components/Table/ServiceRenderer";
import UrlRenderer from "@/Components/Table/UrlRenderer";
import { DownloadSvg, PdfSvg, ReplySvg } from "@/public/icons/icons";
import FormTextArea from "@/Components/TextArea/TextArea";
import ErrorMessage from "@/Components/ErrorMessage";

export default function ReplyView({ submitEndpoint, returnUrl }) {
    const [initialValues, setInitialValues] = useState({
        reply: ''
    })

    const [validationSchema, setValidationSchema] = useState({
        reply: Yup.string().required('Reply is required'),
    })

    const [message, setMessage] = useState(null);

    const router = useRouter();

    const params = useSearchParams();

    const id = params.get('id');

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

    const handleFormSubmit = async (value) => {
        setMessage(null)

        console.log('submitting', value);

        await postRequestHandler2({
            route: submitEndpoint, body: { ...value, id },
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    window?.parent?.postMessage({ success: true }, '*')
                    message = 'Your reply has been sent'

                    window.location.replace(returnUrl)
                    //router.replace(returnUrl);
                }
                else if (body?.error) {
                    message = body.error
                }
                else {
                    console.log('update failed');
                    message = 'Data was not saved'
                }

                setMessage(message)
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setMessage('Try again later')
            }
        })
    }


    return <Box sx={{ width: '100%' }}>
        <BackButton title={'Reply Enquiry'} />

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

                {/* Form for reply */}
                <Box sx={{ width: '100%' }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={() => Yup.object(validationSchema)}
                        onSubmit={handleFormSubmit}>
                        {(formProps) => (
                            <Form style={{ width: '100%', marginBottom: '36px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                                    {message && <ErrorMessage message={message} />}

                                    <Box sx={{ mb: 2, width: '100%' }}>
                                        {/* Label */}
                                        <FieldLabel label={'Response'} />

                                        {/* Textfield */}
                                        <FormTextArea placeholder={'Type response here...'} name='reply' />
                                    </Box>

                                    {<SubmitButton fullWidth={false} marginTop={0} label={'Send'} formProps={formProps} />}
                                </Box>
                            </Form>)}
                    </Formik>
                </Box>

            </Box> : <Loader />
        }
    </Box >
}