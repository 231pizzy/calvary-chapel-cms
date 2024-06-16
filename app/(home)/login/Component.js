'use client'

import { Box, Button, CircularProgress, OutlinedInput, Typography } from "@mui/material";

import { useState, useEffect } from "react";

import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { postRequestHandler } from "@/Components/requestHandler";
import { Form, Formik, useFormik } from "formik";
import { textValues } from "@/utils/textValues";
import FormTextField from "@/Components/TextField/TextField";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";

console.log('login page called')

export default function Login() {
    const router = useRouter()

    const [initialValues, setInitialValues] = useState({ email: '', password: '' })
    const [validationSchema, setValidationSchema] = useState({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required')
    })

    const [state, setState] = useState({
        email: { value: '', errMsg: '' }, password: { value: '', errMsg: '' },
        showPassword: false, message: ''
    });

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };


    useEffect(() => {
        router.prefetch('/receive-otp')
    }, [])

    const gotoForgotPassword = () => {
        router.push('/receive-otp')
    }

    const handleFormSubmit = async (value) => {
        const body = { email: value?.email, password: value?.password }

        console.log('submitting', value, body);

        await postRequestHandler({
            route: '/api/login', body: body,
            successCallback: body => {
                const result = body?.result;
                console.log('result', result)
                let message = ''
                if (result) {
                    console.log('logged in');
                    router.replace('/');
                    message = 'Login successful!!'
                    window?.parent?.postMessage({ success: true }, '*')
                }
                else {
                    console.log('invalid login data');
                    message = 'Your email or password is invalid'
                }

                updateState({ message: message })
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                updateState({ message: 'Try again later' })
            }
        })
    }

    const label = ({ label, color, align }) => {
        return <Typography sx={{
            color: color ?? '#333333', textAlign: align ?? 'inherit',
            fontWeight: 700, fontSize: { xs: 12, md: 14 }, lineHeight: '24.51px'
        }}>
            {label}
        </Typography>
    }


    return (
        <Box sx={{ maxWidth: '100%', }}>
            {state.message && label({ label: state.message, color: 'red', align: 'center' })}

            <Formik
                initialValues={initialValues}
                validationSchema={() => Yup.object(validationSchema)}
                onSubmit={handleFormSubmit}>
                {(formProps) => (
                    <Form>
                        <Box sx={{ mb: 3, mt: 1 }}>
                            <FormTextField type='email' name='email' placeholder={textValues.login.email} />
                        </Box>

                        <Box>
                            <FormTextField type='password' name='password' placeholder={textValues.login.password} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button id='forgotPswd' variant="text" sx={{
                                fontWeight: 600, fontSize: 11, lineHeight: '24.51px'
                            }}
                                onClick={gotoForgotPassword}>
                                {textValues.login.forgotPassword}
                            </Button>
                        </Box>

                        <SubmitButton label={textValues.login.login} formProps={formProps} />
                    </Form>
                )}
            </Formik>
        </Box>

    );
}
