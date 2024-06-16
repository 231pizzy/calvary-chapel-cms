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
import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import { CancelSvg } from "@/public/icons/icons";
import BackButton from "@/Components/BackButton/BackButton";
import Loader from "@/Components/Loader/Loader";

export default function EditView({ ministry, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '', heroSubtitle: '', leaders: [{
            name: '', email: '', role: '', about: '', image: []
        }]
    });

    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),
        leaders: Yup.array().of(Yup.object().shape({
            name: Yup.string().required('Full name is required'),
            email: Yup.string().email('Please provide a valid email address').required('Email address is required'),
            role: Yup.string().required('Post held is required'),
            image: Yup.array(),
            about: Yup.string().required('Please provide some information about this person'),
        })),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        getRequestHandler({
            route: `/api/leadership`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {

                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
                        leaders: result?.leaders?.map(item => {
                            return { ...item, image: item?.image && [{ [item?.image]: item?.image }] }
                        })
                        /*  section1Image: [{ [result?.section1Image]: generateFileUrl(result?.section1Image) }],
                         section2Image: [{ [result?.section2Image]: generateFileUrl(result?.section2Image) }],
                         section3Image: [{ [result?.section3Image]: generateFileUrl(result?.section3Image) }], */
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

    const processData = (values) => {
        return values?.map(item => {
            return { ...item, image: item?.image?.length && getImageFromArray(item?.image[0])?.file }
        })
    }

    const buildFilePayload = (values) => {
        //Email address of the leaders will be used to identify their image
        const fileObject = {};
        values?.forEach((item, index) => item?.image?.length && (fileObject[item?.email] = getImageFromArray(item?.image[0])?.file))

        return fileObject
    }


    const handleFormSubmit = async (value) => {
        const body = {
            ...value, banner: getImageFromArray(value?.banner[0])?.file,
            leaders: JSON.stringify(value?.leaders),
            ...buildFilePayload(value?.leaders), pageName
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
                    message = 'Leadership Updated'
                    window?.parent?.postMessage({ success: true }, '*')
                }
                else {
                    console.log('update failed');
                    message = 'Update failed'
                }
                handleClosePreview();
                // router.replace(returnUrl)

                setMessage(message)
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                setMessage('Try again later')
                throw err
            }
        })
    }


    const handleAddNewLeader = (formProps) => {
        formProps.setFieldValue('leaders', [...(formProps.values.leaders),
        { name: '', email: '', role: '', about: '', image: [] }])
    }

    const removeLeader = (formProps, index) => {
        formProps.setFieldValue('leaders', formProps.values.leaders?.filter((i, indx) => indx !== index))
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
                {(formProps) => {
                    console.log('form values', formProps.values)
                    return (
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
                                <SectionHeading label={'body section'} />

                                {/* Content */}
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2,
                           /*  justifyContent: { xs: 'center', md: 'space-between' }, */ width: '100%'
                                }}>
                                    {/* Leaders */}
                                    {formProps.values?.leaders?.map((leader, index) => {
                                        return <Box key={index} sx={{
                                            width: '100%', mb: 4, display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {/* Image,name,email,post held */}
                                            {formProps.values?.leaders?.length > 1 && < CancelSvg style={{ cursor: 'pointer', marginLeft: 'auto' }}
                                                onClick={() => { removeLeader(formProps, index) }}
                                            />}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100%' }}>
                                                {/* Image */}
                                                <Box sx={{ minWidth: '150px', maxWidth: '150px' }}>
                                                    <AvatarUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, `leaders[${index}].image`) }}
                                                        fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                                        multiple={false} fileArray={(formProps.values.leaders ?? [])[index]?.image}
                                                        error={((formProps.errors.leaders ?? [])[index]?.image) ? (formProps.errors.leaders ?? [])[index]?.image : null}
                                                        accept={{ 'image/*': ['.png', '.gif'], }}
                                                        extensionArray={['PNG', 'JPG']}
                                                    />
                                                </Box>

                                                {/* name,email,post held */}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%', ml: 5 }}>
                                                    {/* Name */}
                                                    <Box sx={{ mb: 2, width: '100%' }}>
                                                        {/* Label */}
                                                        <FieldLabel label={'Full Name'} />

                                                        {/* Textfield */}
                                                        <FormTextField placeholder={'Full Name'} name={`leaders[${index}].name`} />
                                                    </Box>

                                                    {/* Email */}
                                                    <Box sx={{ mb: 2, width: '100%' }}>
                                                        {/* Label */}
                                                        <FieldLabel label={'Email Address'} />

                                                        {/* Textfield */}
                                                        <FormTextField placeholder={'Email Address'} name={`leaders[${index}].email`} />
                                                    </Box>

                                                    {/* Post Held */}
                                                    <Box sx={{ mb: -4, width: '100%' }}>
                                                        {/* Label */}
                                                        <FieldLabel label={'Post held'} />

                                                        {/* Textfield */}
                                                        <FormTextField placeholder={'Post held'} name={`leaders[${index}].role`} />
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* About me */}
                                            <Box sx={{ mt: 8, width: '100%' }}>
                                                {/* Label */}
                                                <FieldLabel label={'About Me'} />

                                                {/* Textfield */}
                                                <FormTextArea placeholder={'About Me'} name={`leaders[${index}].about`} />
                                            </Box>
                                        </Box>
                                    })}

                                </Box>
                            </Box>


                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                                <Button variant="outlined" onClick={() => { handleAddNewLeader(formProps) }}
                                    sx={{ width: '30%', borderRadius: '24px', py: 1, mr: 1 }} >
                                    Add New Leader
                                </Button>

                                <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                    sx={{ width: '30%', borderRadius: '24px', py: 1 }}
                                    disabled={!formProps.isValid/*  || !formProps.dirty */}>
                                    Preview
                                </Button>
                            </Box>

                            {showPreview && <Preview handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                                formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}

                        </Form>
                    )
                }}
            </Formik>
                : <Loader />}
        </Box >
    </Box>

}