'use client'

import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";

import VisibilityOn from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useState, useMemo, useEffect } from "react";
import * as Yup from 'yup';

import styled from "@emotion/styled";

import { v4 as uuid } from 'uuid';
import { useRouter, useSearchParams } from "next/navigation";
import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";
import { textValues } from "@/utils/textValues";
import { Form, Formik } from "formik";
import FormTextField from "@/Components/TextField/TextField";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";

function NewPasword() {
    const router = useRouter();
    const token = useSearchParams().get('token');

    const [initialValues, setInitialValues] = useState({ email: '', password: '' })
    const [validationSchema, setValidationSchema] = useState({
        password: Yup.string().required('Password is required'),
        passwordConfirmation: Yup.string().required('Password is required')
    })

    // const disabledButtons = useSelector(state => state.route.disabledButtons);

    const [state, setState] = useState({
        password: { value: '', errMsg: '' }, checkingToken: true,
        showPassword: false, message: '', validToken: false, passwordChanged: false
    });

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };

    useEffect(() => {
        postRequestHandler({
            route: '/api/verify-token',
            body: { token },
            successCallback: body => {
                const result = body.result;
                let message = ''
                if (result) {
                    updateState({ checkingToken: false, validToken: true })
                }
                else {
                    message = 'Invalid Token'
                    updateState({ validToken: false })
                    router.replace('/login')
                }
                updateState({ message: message })
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                updateState({ message: 'Try again later' })
            }
        }).then(

        )
    }, []);

    const handleSubmit = async (value) => {
        console.log('handle submit');
        if (value.password !== value?.passwordConfirmation) {
            updateState({ message: 'The passwords do not match' })
            return false;
        }

        await postRequestHandler({
            route: '/api/change-password',
            body: { password: value.password },
            successCallback: body => {
                const result = body.result;
                let message = ''
                if (result) {
                    console.log('password changed');
                    message = 'Password changed'
                    router.replace('/password-changed')
                }
                else {
                    console.log('password was not changed')
                    message = 'Password was not changed'
                }
                updateState({ message: message, passwordChanged: Boolean(result) })
            },
            errorCallback: err => {
                console.log('something went wrong', err)
                updateState({ message: 'Try again later' })
            }
        })
    }

    return (
        <Box sx={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{
            state.validToken ? <Box sx={{ mb: 3, textAlign: 'center' }} >
                {/*  */}
                <Typography sx={{ color: 'grey[500]', fontSize: { xs: 10, sm: 14 }, mb: 1 }}>
                    {textValues.newPassword.instruction}
                </Typography>

                {(state.message) &&
                    <Typography sx={{
                        color: '#BF0606', fontWeight: 700, fontSize: 12, lineHeight: '24.51px',
                        textAlign: 'center',
                    }}>
                        {state.message}
                    </Typography>}

                <Formik
                    initialValues={initialValues}
                    validationSchema={() => Yup.object(validationSchema)}
                    onSubmit={handleSubmit}>
                    {(formProps) => (
                        <Form>
                            <Box sx={{ mb: 3, mt: 1 }}>
                                <FormTextField type='password' name='password' placeholder={textValues.login.password} />
                            </Box>

                            <Box>
                                <FormTextField type='password' name='passwordConfirmation' placeholder={textValues.login.password} />
                            </Box>

                            <SubmitButton label={textValues.newPassword.submitButtonLabel} formProps={formProps} />
                        </Form>
                    )}
                </Formik>

            </Box> : <CircularProgress sx={{ mx: 'auto' }} />}
        </Box>

    );
}

export default NewPasword;