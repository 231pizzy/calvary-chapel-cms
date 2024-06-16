'use client'

import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import BackButton from "@/Components/BackButton/BackButton";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import FormTextField from "@/Components/TextField/TextField";
import ModalMessage from "@/Components/ModalMessage/ModalMessage";
import { getRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import { Box, Button, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import FormTextArea from "../TextArea/TextArea";
import Preview from "./Preview";
import Loader from "../Loader/Loader";

export default function EditView({ submitEndpoint, returnUrl }) {
    const router = useRouter();

    const params = useSearchParams();
    const tag = params.get('tag')
    const name = params.get('name')
    const parent = params.get('parent')
    const [showPreview, setShowPreview] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [initialValues, setInitialValues] = useState({
        title: '', description: '',
    })

    const [validationSchema, setValidationSchema] = useState({
        title: Yup.string().required('Meta title is required').min(30).max(60),
        description: Yup.string().required('Meta description is required').min(60).max(150),
    })

    const [message, setMessage] = useState(null);
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        getRequestHandler({
            route: `/api/meta-view?tag=${tag}&&parent=${parent}`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues(result)

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


    const handleFormSubmit = async (value) => {
        setMessage(null)

        console.log('submitting', value);

        await postRequestHandler2({
            route: submitEndpoint, body: { ...value, tag: params?.get('tag'), parent: params.get('parent') },
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    setSaved(true)
                    window?.parent?.postMessage({ success: true }, '*')
                    router.replace(returnUrl)
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

    const handleShowPreview = (formProps) => {
        console.log('form values', formProps?.values)
        setShowPreview(true)
    }

    const handleClosePreview = () => {
        setShowPreview(false)
    }

    const closeSuccessAlert = () => {
        setSaved(false)
        router.replace(returnUrl);
    }


    return <Box sx={{ width: '100%' }}>
        <BackButton title={`Edit Meta Information for ${name}`} />

        {showForm ? <Box sx={{ maxWidth: { xs: '95%', sm: '70%', lg: '70%' }, mt: 4, mx: 'auto' }}>
            <Formik
                initialValues={initialValues}
                validationSchema={() => Yup.object(validationSchema)}
                onSubmit={handleFormSubmit}>
                {(formProps) => (
                    <Form style={{ width: '100%', marginBottom: '36px' }}>
                        <Box sx={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', width: '100%',
                        }}>
                            <Box sx={{
                                width: '100%', bgcolor: '#F8F8F8', px: 3, py: 2, display: 'flex',
                                flexDirection: 'column', alignItems: 'center', mb: 2, borderRadius: '12px',
                                border: '1px solid #1414171A'
                            }}>
                                {/*  Message */}
                                {message && <Typography sx={{ color: 'red', fontSize: 13, mb: 3 }}>
                                    {message}
                                </Typography>}

                                {/* Meta Title */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', maxWidth: '100%',
                                        justifyContent: 'space-between'
                                    }}>
                                        <FieldLabel label={'Meta Title'} />
                                        <Typography sx={{ fontSize: 13, fontWeight: 400 }}>
                                            30-60 characters
                                        </Typography>
                                    </Box>

                                    {/* Textfield */}
                                    <FormTextField maxLength={60} placeholder={'Meta Title'} name='title' />
                                </Box>

                                {/* Meta Description */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', maxWidth: '100%',
                                        justifyContent: 'space-between'
                                    }}>
                                        <FieldLabel label={'Meta Description'} />
                                        <Typography sx={{ fontSize: 13, fontWeight: 400 }}>
                                            60-150 characters
                                        </Typography>
                                    </Box>

                                    {/* Textfield */}
                                    <FormTextArea maxLength={150} plain={true} placeholder={'Meta Description'} name='description' />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4, width: '60%' }}>
                                <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                    sx={{ width: '100%', borderRadius: '24px', py: 1 }}
                                    disabled={!formProps.isValid}>
                                    Preview
                                </Button>
                            </Box>

                            {/* Publish button */}
                            {/*   {<SubmitButton fullWidth={false} marginTop={0} label={'Create'} formProps={formProps} />} */}
                        </Box>

                        {showPreview && <Preview handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                            formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}
                    </Form>)
                }
            </Formik>
        </Box> : <Loader />}

        {saved && <ModalMessage
            title={'Meta Data Updated'} open={saved} handleCancel={closeSuccessAlert} type='success'
            message={'You have just updated the meta information'} />}

    </Box >
}