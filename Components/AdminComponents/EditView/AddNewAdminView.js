'use client'

import AvatarUpload from "@/Components/AvatarUpload/AvatarUpload";
import BackButton from "@/Components/BackButton/BackButton";
import FieldLabel from "@/Components/FieldLabel/FieldLabel";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import FormTextField from "@/Components/TextField/TextField";
import ModalMessage from "@/Components/ModalMessage/ModalMessage";
import { postRequestHandler2 } from "@/Components/requestHandler";
import { Box, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from 'yup';

export default function AddNewAdminView({ submitEndpoint, returnUrl }) {
    const router = useRouter();

    const [initialValues, setInitialValues] = useState({
        profilePicture: [], fullName: '', email: '', password: ''
    })

    const [validationSchema, setValidationSchema] = useState({
        profilePicture: Yup.array(),
        fullName: Yup.string().required('Full name is required'),
        email: Yup.string().email('Please enter a valid email address').required('Email address is required'),
        password: Yup.string().required('Password is required'),
    })

    const [message, setMessage] = useState(null);
    const [saved, setSaved] = useState(false)

    const handleFileUpload = (fileArrayOfObjects, formProps, id) => {
        formProps.setFieldValue(id, fileArrayOfObjects)
    };

    const getImageFromArray = (source) => {
        const key = Object.keys(source ?? {})[0]
        return { filename: key, file: source[key] }
    }

    const handleFormSubmit = async (value) => {
        setMessage(null)
        const body = {
            ...value, profilePicture: value?.profilePicture?.length && getImageFromArray(value?.profilePicture[0])?.file,
        }

        console.log('submitting', value, body);

        await postRequestHandler2({
            route: submitEndpoint, body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {

                    message = 'Admin Created'
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
        //  router.replace(returnUrl);
        window.location.replace(returnUrl)
    }


    return <Box sx={{ width: '100%' }}>
        <BackButton title={'Create New Admin'} />

        <Box sx={{ maxWidth: { xs: '95%', sm: '70%', lg: '50%' }, mt: 4, mx: 'auto' }}>
            <Formik
                initialValues={initialValues}
                validationSchema={() => Yup.object(validationSchema)}
                onSubmit={handleFormSubmit}>
                {(formProps) => (
                    <Form style={{ width: '100%', marginBottom: '36px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                            {/* Profile picture */}
                            <Box sx={{ mb: 2, width: '100%' }}>
                                {/* File upload Field */}
                                <AvatarUpload handleChange={(fileArray) => { handleFileUpload(fileArray, formProps, `profilePicture`) }}
                                    fileHeight={'1440'} fileWidth={'400'} maxSize={'50MB'}
                                    multiple={false} fileArray={formProps.values.profilePicture}
                                    error={formProps.errors.profilePicture}
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
                                {/* Label */}
                                <FieldLabel label={'Full Name'} />

                                {/* Textfield */}
                                <FormTextField placeholder={'full name'} name='fullName' />
                            </Box>

                            {/* Email address */}
                            <Box sx={{ mb: 2, width: '100%' }}>
                                {/* Label */}
                                <FieldLabel label={'Email Address'} />

                                {/* Textfield */}
                                <FormTextField type='email' placeholder={'Email address'} name='email' />
                            </Box>

                            {/* Password */}
                            <Box sx={{ mb: 2, width: '100%' }}>
                                {/* Label */}
                                <FieldLabel label={'Password'} />

                                {/* Textfield */}
                                <FormTextField type='password' placeholder={'Password'} name='password' />
                            </Box>

                            {/* Publish button */}
                            {<SubmitButton fullWidth={false} marginTop={0} label={'Create'} formProps={formProps} />}
                        </Box>
                    </Form>)
                }
            </Formik>
        </Box>

        {saved && <ModalMessage
            title={'Admin Created'} open={saved} handleCancel={closeSuccessAlert} type='success'
            message={'You have just created a new admin'} />}

    </Box >
}