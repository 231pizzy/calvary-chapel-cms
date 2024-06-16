'use client'

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';

import { useEffect, useState } from "react";
import { getRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import FormTextField from "@/Components/TextField/TextField";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import generateFileUrl from "@/utils/getImageUrl";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import Loader from "@/Components/Loader/Loader";

export default function EditView({ closeForm, id, submitEndpoint, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        image: [], name: ''
    })
    const [validationSchema, setValidationSchema] = useState({
        image: Yup.array(),
        name: Yup.string().required('Full name is required'),
    })

    const [message, setMessage] = useState(null);

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        getRequestHandler({
            route: `/api/guest-speakers?id=${id}`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
                        image: [{ [result?.image]: generateFileUrl(result?.image) }],
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
                console.log('Something went wrong', err)
            }
        })
    }, [])

    const handleFileUpload = (fileArrayOfObjects, formProps, id) => {
        formProps.setFieldValue(id, fileArrayOfObjects)
    };


    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }



    const handleFormSubmit = async (value) => {
        const body = {
            ...value, id, image: value?.image[0] && getImageFromArray(value?.image[0])?.file,
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    closeForm();
                    window.location.reload()
                    message = 'Guest Speaker Updated'
                    window?.parent?.postMessage({ success: true }, '*')
                }
                else {
                    console.log('update failed');
                    message = body?.error
                }

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
        width: { xs: '95%', lg: '100%' }, py: { xs: 1, md: 2, lg: 3 }, mx: 'auto'
    }}>
        {showForm ? <Formik
            initialValues={initialValues}
            validationSchema={() => Yup.object(validationSchema)}
            onSubmit={handleFormSubmit}>
            {(formProps) => (
                <Form style={{ width: '100%', marginBottom: '36px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                        {/* Profile picture */}
                        <Box sx={{ mb: 2, width: '100%' }}>
                            {/* File upload Field */}
                            <AvatarUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, `image`) }}
                                fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                multiple={false} fileArray={formProps.values.image}
                                error={formProps.errors.image}
                                accept={{ 'image/*': ['.png', '.gif'], }} round={true}
                                extensionArray={['PNG', 'JPG']}
                            />
                        </Box>

                        {/*  Message */}
                        {message && <Typography sx={{ color: 'red', fontSize: 13, mb: 3 }}>
                            {message}
                        </Typography>}

                        {/* Full name */}
                        <Box sx={{ mb: 2, width: '100%' }}>
                            {/* Textfield */}
                            <FormTextField placeholder={'full name'} name='name' />
                        </Box>

                        {/* Publish button */}
                        {<SubmitButton fullWidth={false} marginTop={0} label={'Create'} formProps={formProps} />}
                    </Box>
                </Form>
            )}
        </Formik>
            : <Loader />}
    </Box >
}