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
import Preview from "./Preview";
import generateFileUrl from "@/utils/getImageUrl";
import { useRouter } from "next/navigation";
import BackButton from "@/Components/BackButton/BackButton";

export default function HeroEditView({ title, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '', heroSubtitle: '',
    })
    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        getRequestHandler({
            route: `/api/hero?page=${pageName}`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
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
            pageName
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    router.replace(returnUrl);
                    message = `${title} saved`
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
        <BackButton title={`Edit ${title} Hero Section`} />

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

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                            <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                sx={{ width: '60%', borderRadius: '24px', py: 1 }}
                                disabled={!formProps.values.banner || !formProps.values.heroText}>
                                Preview
                            </Button>
                        </Box>

                        {showPreview && <Preview handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                            formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}
                    </Form>
                )}
            </Formik>
                : <CircularProgress />}
        </Box >
    </Box>

}