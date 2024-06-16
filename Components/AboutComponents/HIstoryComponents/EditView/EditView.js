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
import BackButton from "@/Components/BackButton/BackButton";
import Loader from "@/Components/Loader/Loader";

export default function EditView({ ministry, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '', heroSubtitle: '', section1Image: [], section1Heading: '', section1Text: '',
        section2Image: [], section2Heading: '', section2Text: '', section3Image: [], section3Heading: '', section3Text: ''
    })
    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),
        section1Image: Yup.array().required('Section 1 Image is required'),
        section1Heading: Yup.string().required('Section 1 Title is required'),
        section1Text: Yup.string().required('Section 1 Details is required'),
        section2Image: Yup.array().required('Section 2 Image is required'),
        section2Heading: Yup.string().required('Section 2 Title is required'),
        section2Text: Yup.string().required('Section 2 Details is required'),
        section3Image: Yup.array().required('Section 3 Image is required'),
        section3Heading: Yup.string().required('Section 3 Title is required'),
        section3Text: Yup.string().required('Section 3 Details is required'),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        getRequestHandler({
            route: `/api/history`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
                        section1Image: [{ [result?.section1Image]: generateFileUrl(result?.section1Image) }],
                        section2Image: [{ [result?.section2Image]: generateFileUrl(result?.section2Image) }],
                        section3Image: [{ [result?.section3Image]: generateFileUrl(result?.section3Image) }],
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
            section1Image: getImageFromArray(value?.section1Image[0])?.file,
            section2Image: getImageFromArray(value?.section2Image[0])?.file,
            section3Image: getImageFromArray(value?.section3Image[0])?.file,
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
                    message = 'History of CCT Saved'
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


                        {/* /////////////////////////////////////////////////////////////////////// */}

                        {/* Body section 1 */}
                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 8 }}>
                            {/* Section header */}
                            <SectionHeading label={'body section - 1'} />

                            {/* Content */}
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                           /*  justifyContent: { xs: 'center', md: 'space-between' }, */ width: '100%'
                            }}>
                                {/* Body title */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Section One Title'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Section One Title'} name='section1Heading' />
                                </Box>


                                {/* Body text */}
                                <Box sx={{
                                    width: '100%', height: 'max-content', pb: 1, display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Body details */}
                                    <Box sx={{ mb: 2, width: '100%' }}>
                                        {/* Label */}
                                        <FieldLabel label={'Section One Details'} />

                                        {/* Textfield */}
                                        <FormTextArea rows={8} placeholder={'Section One Details'} name='section1Text' />
                                    </Box>

                                    {/* Body Image */}
                                    <Box sx={{ width: 'max-content', ml: 2 }}>
                                        <FieldLabel label={'Upload section one image here'} />

                                        <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'section1Image') }}
                                            fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'} width='30vw' height='15vw'
                                            multiple={false} fileArray={formProps?.values?.section1Image}
                                            error={(formProps.errors?.section1Image) ? formProps.errors?.section1Image : null}
                                            accept={{ 'image/*': ['.png', '.gif'], }}
                                            extensionArray={['PNG', 'JPG']}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>


                        {/* /////////////////////////////////////////////////////////////////////// */}

                        {/* Body section 2 */}
                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 2 }}>
                            {/* Section header */}
                            <SectionHeading label={'body section - 2'} />

                            {/* Content */}
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: { xs: 'center', md: 'space-between' }, width: '100%'
                            }}>
                                {/* Body Image */}
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <FieldLabel label={'Upload section Two image here'} />

                                    <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'section2Image') }}
                                        fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'} height='15vw' width='100%'
                                        multiple={false} fileArray={formProps?.values?.section2Image}
                                        error={(formProps.errors?.section2Image) ? formProps.errors?.section2Image : null}
                                        accept={{ 'image/*': ['.png', '.gif'], }}
                                        extensionArray={['PNG', 'JPG']}
                                    />
                                </Box>

                                {/* Body title */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Section Two Title'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Section Two Title'} name='section2Heading' />
                                </Box>

                                {/* Body details */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Section Two Details'} />

                                    {/* Textfield */}
                                    <FormTextArea placeholder={'Section Two Details'} name='section2Text' />
                                </Box>
                            </Box>
                        </Box>


                        {/* /////////////////////////////////////////////////////////////////////// */}

                        {/* Body section 3 */}
                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 8 }}>
                            {/* Section header */}
                            <SectionHeading label={'body section - 3'} />

                            {/* Content */}
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                width: '100%'
                            }}>
                                {/* Body title */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'section Three Title'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Section Three Title'} name='section3Heading' />
                                </Box>

                                {/* Body text */}
                                <Box sx={{
                                    width: '100%', height: 'max-content', pb: 1, display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Body Image */}
                                    <Box sx={{ width: 'max-content', mr: 2 }}>
                                        <FieldLabel label={'Upload section Three image here'} />

                                        <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'section3Image') }}
                                            fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'} width='20vw' height='40vw'
                                            multiple={false} fileArray={formProps?.values?.section3Image}
                                            error={(formProps.errors?.section3Image) ? formProps.errors?.section3Image : null}
                                            accept={{ 'image/*': ['.png', '.gif'], }}
                                            extensionArray={['PNG', 'JPG']}
                                        />
                                    </Box>

                                    {/* Body details */}
                                    <Box sx={{ mb: 2, width: '100%' }}>
                                        {/* Label */}
                                        <FieldLabel label={'Section Three Details'} />

                                        {/* Textfield */}
                                        <FormTextArea rows={15} placeholder={'Section Three Details'} name='section3Text' />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                            <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                sx={{ width: '60%', borderRadius: '24px', py: 1 }}
                                disabled={!formProps.isValid}>
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