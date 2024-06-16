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
import { CancelSvg } from "@/public/icons/icons";
import BackButton from "@/Components/BackButton/BackButton";
import Loader from "@/Components/Loader/Loader";

export default function EditView({ ministry, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '', heroSubtitle: '', bodyTitle: '', bodyImage: [], //sections: []
    })
    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),
        bodyTitle: Yup.string().required('Body Title is required'),
        bodyImage: Yup.array().required('Body Background Image is required'),
        // sections: Yup.array().min(1, 'Add at least one section'),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [sections, setSections] = useState([])

    const [showForm, setShowForm] = useState(false);

    const formatData = (data) => {

        const sectionKeyArray = [];
        const initals = {};
        const validations = {};
        //Get the keys
        (Object.keys(data).forEach(item => {
            if (item?.includes('-spliter-')) {
                const key = item?.split('-spliter-')[0]

                if (sectionKeyArray.includes(key)) return false
                const title = `${key}-spliter-title`;
                const description = `${key}-spliter-description`

                initals[title] = data[title]
                initals[description] = data[description]
                validations[title] = Yup.string().required('This field is required')
                validations[description] = Yup.string().required('This field is required')

                sectionKeyArray.push(key)
            }
        }))

        console.log('data returned by formatter', { sections: sectionKeyArray, initals, validations })

        return { sections: sectionKeyArray, initals, validations }
    }

    const createNewRecord = (formProps) => {
        const key = window.crypto.randomUUID();
        const title = `${key}-spliter-title`;
        const description = `${key}-spliter-description`
        const initialVs = { ...initialValues, [title]: '', [description]: '', };
        const validation = {
            ...validationSchema,
            [title]: Yup.string().required('This field is required'),
            [description]: Yup.string().required('This field is required'),
        }


        setSections([...sections, key])
        setInitialValues(initialVs)
        setValidationSchema(validation)
        formProps && formProps.setValues({ ...formProps?.values, /* [title]: '', [description]: '' */ })

        return { key, initialValues, validationSchema }
    }


    const processResult = (result) => {

    }

    useEffect(() => {
        getRequestHandler({
            route: `/api/faith`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    const formattedData = formatData(result?.sections)
                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
                        bodyImage: [{ [result?.bodyImage]: generateFileUrl(result?.bodyImage) }],
                        ...formattedData.initals
                        // ...processResult(result?.sections)
                    })

                    setValidationSchema({ ...validationSchema, ...formattedData?.validations });
                    setSections(formattedData?.sections)

                    setTimeout(() => {
                        setShowForm(true)
                    }, 2000)
                    //setData()
                }
                else {
                    setShowForm(true)
                    createNewRecord()
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

    const getSection = (body) => {
        const sections = {};

        Object.keys(body).forEach(item => {
            if (!item?.includes('-spliter-')) return false
            sections[item] = body[item];
        })

        console.log('section for submit', sections);

        return sections
    }


    const handleFormSubmit = async (value) => {
        const body = {
            ...value, banner: getImageFromArray(value?.banner[0])?.file, sections: JSON.stringify(getSection(value)),
            bodyImage: getImageFromArray(value?.bodyImage[0])?.file, pageName,
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
                    message = 'Statement of Faith Created'
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

    const removeSection = (key, initialValues, validationSchema, sections, formProps) => {
        const title = `${key}-spliter-title`;
        const description = `${key}-spliter-description`
        //Remove from initalvalues
        const copyInitialValues = { ...initialValues };
        delete copyInitialValues[title]
        delete copyInitialValues[description]

        //Remove from validation schema
        const copyValidationSchema = { ...validationSchema };
        delete copyValidationSchema[title]
        delete copyValidationSchema[description]

        //Remove from values
        const values = { ...formProps.values };
        delete values[title]
        delete values[description]


        //Set the new values
        setInitialValues(copyInitialValues)
        setValidationSchema(copyValidationSchema)
        setSections(sections.filter(i => i !== key))
        formProps.setValues(values)
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

                        {/* /////////////////////////////////////////////////////////////// */}

                        {/* Body section */}
                        <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 8 }}>
                            {/* Section header */}
                            <SectionHeading label={'body section'} />

                            {/* Content */}
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'
                            }}>
                                {/* Body Image */}
                                <Box sx={{ width: '100%' }}>
                                    <FieldLabel label={'Body background image'} />

                                    <FileUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, 'bodyImage') }}
                                        fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'} width='100%' height='15vw'
                                        multiple={false} fileArray={formProps?.values?.bodyImage}
                                        error={(formProps.errors?.bodyImage) ? formProps.errors?.bodyImage : null}
                                        accept={{ 'image/*': ['.png', '.gif'], }}
                                        extensionArray={['PNG', 'JPG']}
                                    />
                                </Box>


                                {/* Body Title */}
                                <Box sx={{ mt: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Body Title'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Title'} name='bodyTitle' />
                                </Box>

                                {/* Sections */}
                                <Box sx={{ width: '100%' }}>
                                    {sections.map((sectionKey, index) => {
                                        return <Box key={index} sx={{ width: '100%', mt: 4 }}>
                                            {/* Body title */}
                                            <Box sx={{ mb: 2 }}>
                                                {/* Label */}
                                                <Box sx={{
                                                    display: 'flex', alignItems: 'center', width: '100%',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <FieldLabel label={'Title'} />
                                                    <CancelSvg style={{ cursor: 'pointer', }}
                                                        onClick={() => {
                                                            removeSection(sectionKey, initialValues,
                                                                validationSchema, sections, formProps)
                                                        }}
                                                    />
                                                </Box>

                                                {/* Textfield */}
                                                <FormTextField placeholder={'Title'} name={`${sectionKey}-spliter-title`} />
                                            </Box>

                                            {/* Body details */}
                                            <Box sx={{ mb: 2 }}>
                                                {/* Label */}
                                                <FieldLabel label={'Description'} />

                                                {/* Textfield */}
                                                <FormTextArea placeholder={'Description'} name={`${sectionKey}-spliter-description`} />
                                            </Box>
                                        </Box>
                                    })}
                                </Box>

                                {/* Add New section Button */}
                                <Button variant="text" sx={{ fontSize: 12, fontWeight: 600, ml: 'auto' }}
                                    onClick={() => { createNewRecord(formProps) }}>
                                    + Add New
                                </Button>

                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                            <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                                sx={{ width: '60%', borderRadius: '24px', py: 1 }}
                            >
                                Preview
                            </Button>
                        </Box>

                        {showPreview && <Preview handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                            formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}

                    </Form>
                )
                }
            </Formik>
                : <Loader />}
        </Box >
    </Box>

}