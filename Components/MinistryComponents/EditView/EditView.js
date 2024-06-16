'use client'

import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import FileUpload from "@/Components/FileUpload/FileUpload";
import SectionHeading from "@/Components/SectionHeading/SectionHeading";
import { Box, Button, CircularProgress } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';

import { useEffect, useState } from "react";
import { getRequestHandler, postRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import FormTextField from "@/Components/TextField/TextField";
import FormTextArea from "@/Components/TextArea/TextArea";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import Preview from "./Preview";
import generateFileUrl from "@/utils/getImageUrl";
import { useRouter } from "next/navigation";
import Loader from "@/Components/Loader/Loader";
import BackButton from "@/Components/BackButton/BackButton";

export default function EditView({ ministry, submitEndpoint, returnUrl }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '',
        heroSubtitle: '', bodyImage: [], bodyDetails: '', bodyTitle: ''
    })
    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),
        bodyImage: Yup.array().required('Body Image is required'),
        bodyTitle: Yup.string().required('Body Title is required'),
        bodyDetails: Yup.string().required('Body Details is required'),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        getRequestHandler({
            route: `/api/ministry/?ministry=${ministry}`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
                        bodyImage: [{ [result?.bodyImage]: generateFileUrl(result?.bodyImage) }]
                    })

                    setTimeout(() => {
                        setShowForm(true)
                    }, 2000)
                    //setData()
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

    const handleFileUpload = (fileArrayOfObjects, formProps, id) => {
        formProps.setFieldValue(id, fileArrayOfObjects)
    };

    const handleShowPreview = (formProps) => {
        console.log('form values', formProps?.values)
        setShowPreview(true)
    }

    const handleClosePreview = () => {
        setShowPreview(false)
    }

    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }


    const handleFormSubmit = async (value) => {
        const body = {
            ...value, banner: getImageFromArray(value?.banner[0])?.file,
            bodyImage: getImageFromArray(value?.bodyImage[0])?.file, ministry
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    router.replace('/');
                    message = 'Ministry updated'
                    window?.parent?.postMessage({ success: true }, '*')
                }
                else {
                    console.log('update failed');
                    message = 'Update failed'
                }
                handleClosePreview();
                router.replace(returnUrl)

                setMessage(message)
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setMessage('Try again later')
            }
        })
    }


    return <Box sx={{ width: '100%' }}>
        <BackButton title={'Edit'} />

        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
            maxWidth: { xs: '95%', lg: '90%' }, py: { xs: 1, md: 2, lg: 3 }, mx: 'auto'
        }}>
            {showForm ? <Formik
                initialValues={initialValues}
                validationSchema={() => Yup.object(validationSchema)}
                onSubmit={handleFormSubmit}>
                {(formProps) => (
                    <Form style={{ width: '100%', marginBottom: '36px' }}>
                        {/* Hero Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            {/* Section header */}
                            <SectionHeading label={'hero section'} />

                            {/* Image upload */}
                            <Box sx={{ mb: 2 }}>
                                {/* label */}
                                <FieldLabel label={'Upload hero image here'} />
                                {/* File upload Field */}
                                <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'banner') }}
                                    fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'} height={'15vw'} width='100%'
                                    multiple={false} fileArray={formProps?.values?.banner}
                                    error={(formProps.errors?.banner) ? formProps.errors?.banner : null}
                                    accept={{ 'image/*': ['.png', '.gif'], }}
                                    extensionArray={['PNG', 'JPG']}
                                />
                            </Box>

                            {/* Hero Text */}
                            <Box sx={{ mb: 2 }}>
                                {/* Label */}
                                <FieldLabel label={'Hero Text'} />

                                {/* Textfield */}
                                <FormTextField placeholder={'Hero text'} name='heroText' />
                            </Box>

                            {/* Hero subtitle */}
                            <Box sx={{ mb: 2 }}>
                                {/* Label */}
                                <FieldLabel label={'Hero Subtitle'} required={false} />

                                {/* Textfield */}
                                <FormTextArea placeholder={'Subtitle'} name='heroSubtitle' />
                            </Box>
                        </Box>


                        {/* Body section */}
                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 8 }}>
                            {/* Section header */}
                            <SectionHeading label={'body section'} />

                            {/* Content */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: { xs: 'center', md: 'space-between' }, width: '100%'
                            }}>
                                {/* Body Image */}
                                <Box sx={{ width: 'max-content', mr: 2 }}>
                                    <FieldLabel label={'Upload body image here'} />

                                    <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'bodyImage') }}
                                        fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                        multiple={false} fileArray={formProps?.values?.bodyImage}
                                        error={(formProps.errors?.bodyImage) ? formProps.errors?.bodyImage : null}
                                        accept={{ 'image/*': ['.png', '.gif'], }} height={'15vw'} width={'15vw'}
                                        extensionArray={['PNG', 'JPG']}
                                    />
                                </Box>

                                {/* Body text */}
                                <Box sx={{ width: '100%', height: 'max-content', pb: 1 }}>
                                    {/* Body title */}
                                    <Box sx={{ mb: 2 }}>
                                        {/* Label */}
                                        <FieldLabel label={'Body Title'} />

                                        {/* Textfield */}
                                        <FormTextField placeholder={'Body Title'} name='bodyTitle' />
                                    </Box>

                                    {/* Body details */}
                                    <Box sx={{ mb: 2 }}>
                                        {/* Label */}
                                        <FieldLabel label={'Body Details'} />

                                        {/* Textfield */}
                                        <FormTextArea placeholder={'Body Details'} name='bodyDetails' />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
                            <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                sx={{ width: '60%', borderRadius: '24px', py: 1 }}>
                                Preview
                            </Button>
                        </Box>

                        {showPreview && <Preview handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                            formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}

                    </Form>
                )}
            </Formik>
                : <Loader />}
        </Box >
    </Box>
}