'use client'

import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import FileUpload from "@/Components/FileUpload/FileUpload";
import SectionHeading from "@/Components/SectionHeading/SectionHeading";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';

import { useEffect, useState } from "react";
import { getRequestHandler, postRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import FormTextField from "@/Components/TextField/TextField";
import FormTextArea from "@/Components/TextArea/TextArea";
import Preview from "./Preview";
import generateFileUrl from "@/utils/getImageUrl";
import { useRouter, useSearchParams } from "next/navigation";
import CheckboxWithoutTextFieldList from "@/Components/Checkbox/CheckboxWithoutTextField";
import Dropdown from "@/Components/DropdownField/Dropdown";
import Loader from "@/Components/Loader/Loader";

export default function EditView({ ministry, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        banner: [], heroText: '', heroSubtitle: '', details: '',
        address: '', /* addressLink: ``, */ topics: [],
    })
    const [validationSchema, setValidationSchema] = useState({
        banner: Yup.array().min(1, 'Banner is required').required('Banner is required'),
        heroText: Yup.string().required('Hero Text is required'),
        heroSubtitle: Yup.string(),
        address: Yup.string().required('Address is required'),
        // addressLink: Yup.string()./* url('Enter a valid URL'). */required('Please copy and paste the link for this address from Google map'),
        topics: Yup.array().required('Topics is is required'),
        details: Yup.string().required('Details is required'),
    })

    const router = useRouter();

    const params = useSearchParams();
    const id = params.get('id');
    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [prayerTopics, setPrayerTopics] = useState(null);

    const [locations, setLocations] = useState(null);



    useEffect(() => {
        // setShowForm(true)
        getRequestHandler({
            route: `/api/data-for-contact-form`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        banner: [{ [result?.banner]: generateFileUrl(result?.banner) }],
                    })

                    setPrayerTopics(result?.prayerRequestTopics?.map(i => {
                        console.log('looped', i)
                        return {
                            value: i?.id, label: i?.title,
                        }
                    }))

                    setLocations(result?.locations/* ?.map(i => {
                        console.log('looped', i)
                        return {
                            value: i?.id, label: i?.title,
                        }
                    }) */)

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

    const getAddressLink = (link, formProps) => {
        if (!link) return ''
        //const x = //`sdssrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2047.3438091069563!2d7.434218762423025!3d9.063205061040465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e752535045a6d%3A0x1ed6d853ab717f44!2sPCRC%20National%20Secretariat!5e0!3m2!1sen!2sng!4v1703597552591!5m2!1sen!2sng"`
        if (link?.startsWith('http')) return link;

        const startIndex = link.indexOf('src="');
        const endIndex = link.indexOf('"', startIndex + 8)
        const url = link.substring(startIndex + 5, endIndex)
        console.log('index of the src', { startIndex, endIndex, url })

        // formProps.setFieldValue('addressLink', url)

        return url
    }



    const handleFormSubmit = async (value) => {
        const body = {
            ...value, banner: getImageFromArray(value?.banner[0])?.file,
            topics: JSON.stringify(value?.topics), addressLink: getAddressLink(value?.addressLink),
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
                    message = 'Form saved'
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


    const Renderer = ({ value }) => {
        return <Typography sx={{ fontSize: 13, pl: 1, py: 1.5 }}>
            {value}
        </Typography>
    }
    //   getAddressLink()

    const handleChangeAddress = (value, formProps) => {
        formProps.setFieldValue('address', value)
    }

    return <Box sx={{
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
                    <Box sx={{ display: 'flex', mb: 2, flexDirection: 'column', width: '100%' }}>
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
                        <SectionHeading label={'Church Address'} />

                        {/* Content */}
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                           /*  justifyContent: { xs: 'center', md: 'space-between' }, */ width: '100%'
                        }}>
                            {/* Body title */}
                            <Box sx={{ mb: 2, width: '100%' }}>
                                {/* Label */}
                                <FieldLabel label={'Address'} />

                                <Dropdown items={locations?.map(i => {
                                    return { value: i?.id, component: <Renderer value={`${i?.title} (${i?.address})`} /> }
                                })}
                                    placeholder={'Select an address'}
                                    selectedItem={formProps.values.address || null}
                                    handleChange={(value) => { handleChangeAddress(value, formProps) }}
                                />

                                {/* Textfield */}
                                {/*   <FormTextField placeholder={'Eg. Takamaantie 1520720 Turku'} name='address' /> */}
                            </Box>
                        </Box>
                    </Box>


                    {/* /////////////////////////////////////////////////////////////////////// */}

                    {/* Body section 2 */}
                    <Box sx={{ width: '100%', mt: 2, maxHeight: 'max-content', pb: 2 }}>
                        {/* Section header */}
                        <SectionHeading label={'Contact Form'} />

                        {/* Content */}
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'space-between' }, width: '100%'
                        }}>

                            {/* Body title */}
                            <Box sx={{ mb: 2, width: '100%' }}>
                                {/* Label */}
                                <FieldLabel label={'Details'} />

                                {/* Textfield */}
                                <FormTextField placeholder={'Details'} name='details' />
                            </Box>

                            <Box sx={{
                                mb: 2, width: '100%'
                            }}>
                                {/* Heading */}
                                <FieldLabel label={'Choose contact form options to display'} />

                                <CheckboxWithoutTextFieldList name='topics' items={prayerTopics ?? []}
                                    valueKey={'value'}
                                />
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

                    {showPreview && <Preview topics={prayerTopics}
                        handleClose={handleClosePreview}
                        handleSubmit={handleFormSubmit}
                        locations={locations}
                        formProps={formProps}
                        allowPublish={!Object.values(formProps.errors).find(i => i)} />}

                </Form>
            )}
        </Formik>
            : <Loader />}
    </Box >
}