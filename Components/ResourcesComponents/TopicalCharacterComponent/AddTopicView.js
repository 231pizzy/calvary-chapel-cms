'use client'

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from 'yup';

import { useEffect, useState } from "react";
import { getRequestHandler, postRequestHandler2 } from "@/Components/requestHandler";
import FormTextField from "@/Components/TextField/TextField";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/Components/ErrorMessage";

export default function AddTopicView({ closeForm, submitEndpoint, id, name, returnUrl, pageName }) {
    const [initialValues, setInitialValues] = useState({
        sectionTitle: name ?? ''
    })
    const [validationSchema, setValidationSchema] = useState({
        sectionTitle: Yup.string().required("Topical study name is required"),
    })

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [sections, setSections] = useState([])

    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        false && getRequestHandler({
            route: `/api/bible-character`,
            successCallback: body => {
                const result = body?.result;

                console.log('data fetched', result);

                if (result) {
                    setInitialValues({
                        ...result,
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


    const handleFormSubmit = async (value) => {
        const body = {
            ...value, id, pageName
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    window.location.reload()
                    message = 'Topical Character Saved'
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
        {/* {showForm ? */} <Formik
            initialValues={initialValues}
            validationSchema={() => Yup.object(validationSchema)}
            onSubmit={handleFormSubmit}>
            {(formProps) => (
                <Form style={{ width: '100%', marginBottom: '36px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                        {/* name */}
                        <Box sx={{ mb: 2, width: '100%' }}>
                            {/* Textfield */}
                            <FormTextField placeholder={'Topical study name'} name='sectionTitle' />
                        </Box>

                        {Boolean(message) && <ErrorMessage message={message} />}
                        {/* Publish button */}
                        {<SubmitButton fullWidth={false} marginTop={0} label={'Create'} formProps={formProps} />}
                    </Box>
                </Form>
            )}
        </Formik>
        {/* : <CircularProgress />} */}
    </Box >
}