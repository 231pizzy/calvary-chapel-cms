'use client'

import BackButton from "@/Components/BackButton/BackButton";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import FormTextField from "@/Components/TextField/TextField";
import ModalMessage from "@/Components/ModalMessage/ModalMessage";
import { postRequestHandler2 } from "@/Components/requestHandler";
import { Box, Button, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import ErrorMessage from "@/Components/ErrorMessage";
import Loader from "@/Components/Loader/Loader";

import { urlRegex } from "@/Components/HomePageComponent/EditView/EditView";

export default function AddView({ submitEndpoint, returnUrl }) {
    const router = useRouter();
    const params = useSearchParams();

    const [showForm, setShowForm] = useState(false);

    const id = params.get('id');


    const [initialValues, setInitialValues] = useState({
        title: '', link: ''
    })

    const [validationSchema, setValidationSchema] = useState({
        link: Yup.string().matches(urlRegex, 'Please enter a valid URL').required('Live Link is required'),
        title: Yup.string().required('Title is required'),
    })

    const [message, setMessage] = useState(null);
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        !id && setShowForm(true)
        //Get all the guest speakers and leaders
        id && fetch(('/api/live-link-view' + (id ? `?id=${id}` : '')), { method: 'GET' }).then(
            async response => {
                const data = response.status === 200 && await response.json();

                data?.loginRedirect && window.location.replace('/login')
                if (data) {
                    const result = data?.result;

                    if (id) {
                        setInitialValues(result)
                    }

                    setTimeout(() => {
                        setShowForm(true)
                    }, 1000);
                }
            }
        )
    }, [])

    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }


    const handleFormSubmit = async (value) => {
        console.log('submit called');
        setMessage(null)
        const body = {
            ...value,
        }

        id && (body.id = id)

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    setSaved(true)
                    window?.parent?.postMessage({ success: true }, '*')
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


    const closeSuccessAlert = () => {
        setSaved(false)
        window.location.replace(returnUrl)
        //router.replace(returnUrl);
    }


    return <Box sx={{ width: '100%' }}>
        <BackButton title={id ? 'Edit Live Link' : 'Create New Live Link'} />

        {showForm ? <Box sx={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            <Box sx={{ maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mx: 'auto', mt: 4 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={() => Yup.object(validationSchema)}
                    onSubmit={handleFormSubmit}>
                    {(formProps) => {
                        console.log('form values', formProps.values);

                        return (<Form style={{ width: '100%', marginBottom: '36px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                                {/* Email Address */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Name'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Title of live link'} name='title' />
                                </Box>

                                {/* Live Link */}
                                <Box sx={{ mb: 2, width: '100%' }}>
                                    {/* Label */}
                                    <FieldLabel label={'Live Link'} />

                                    {/* Textfield */}
                                    <FormTextField placeholder={'Eg. https://site.com'} name='link' />
                                </Box>

                                {/* UI Message */}
                                {message && <ErrorMessage message={message} />}

                                {/* Publish button */}
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', mt: 4,
                                    justifyContent: 'center', maxWidth: '100%'
                                }}>
                                    {id && <Button variant="outlined" onClick={() => { router.back() }}
                                        sx={{ borderRadius: '24px', mr: 4 }}>
                                        Cancel
                                    </Button>}

                                    {<SubmitButton disabled={!formProps.isValid} fullWidth={false}
                                        marginTop={0} label={id ? 'Save' : 'Create'} formProps={formProps}
                                    />}
                                </Box>

                            </Box>
                        </Form>)
                    }
                    }
                </Formik>
            </Box>

        </Box> : <Loader />}


        {saved && <ModalMessage
            title={id ? 'Live Link Updated' : 'Live Link Created'} open={saved} handleCancel={closeSuccessAlert} type='success'
            message={`You have just ${id ? 'updated this' : 'created a new'} live link`} />}

    </Box >
}