'use client'

import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SectionHeading from "@/Components/SectionHeading/SectionHeading";
import { Box, Button, CircularProgress } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';

import { useEffect, useState } from "react";
import { getRequestHandler, postRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import FormTextField from "@/Components/TextField/TextField";
import Preview from "./Preview";
import { useRouter } from "next/navigation";
import IconUpload from "../IconUpload/IconUpload";
import Loader from "../Loader/Loader";

export default function EditViewHeader({ ministry, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        logo: [], title: ''
    })
    const [validationSchema, setValidationSchema] = useState({
        logo: Yup.array().min(1, 'Logo is required').required('Banner is required'),
        title: Yup.string(),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        getRequestHandler({
            route: `/api/header-footer`,
            successCallback: body => {
                const result = body?.result?.header;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        logo: [{ [result?.logo]: result?.logo }],
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
            ...value, logo: getImageFromArray(value?.logo[0])?.file,
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
                    message = 'Header Updated'
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
                    <SectionHeading label={'Header'} />
                    <Box sx={{ px: 3, py: 2 }}>
                        {/* Logo */}
                        <Box sx={{ minWidth: '150px', mb: 4, maxWidth: '150px' }}>
                            {/* Label */}
                            <FieldLabel label={'Logo'} />

                            <IconUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, `logo`) }}
                                fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                multiple={false} fileArray={formProps.values.logo}
                                error={(formProps.errors.logo)}
                                accept={{ 'image/*': ['.png', '.gif'], }}
                                extensionArray={['PNG', 'JPG']}
                            />
                        </Box>

                        {/* Title */}
                        <Box sx={{ mb: 2, width: '100%' }}>
                            {/* Label */}
                            <FieldLabel label={'Logo Name'} required={false} />

                            {/* Textfield */}
                            <FormTextField placeholder={'Logo Name'} name={`title`} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                        <Button variant="contained" onClick={() => { handleShowPreview(formProps) }}
                            sx={{ width: '60%', borderRadius: '24px', py: 1 }}
                            disabled={!formProps.isValid}>
                            Preview
                        </Button>
                    </Box>

                    {showPreview && <Preview type={'header'} handleClose={handleClosePreview} handleSubmit={handleFormSubmit}
                        formProps={formProps} allowPublish={!Object.values(formProps.errors).find(i => i)} />}

                </Form>
            )}
        </Formik>
            : <Loader />}
    </Box >
}