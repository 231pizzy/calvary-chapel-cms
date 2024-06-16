'use client'

import { Box, Button, Card, CardContent, CircularProgress, Grid, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
/* import { openSnackbar, toggleBlockView } from "../app/routeSlice"; */
/* import { sendOtp, verifyOtp } from "./receiveTokenLogic"; */

import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { getRequestHandler } from "@/Components/requestHandler";
import { textValues } from "@/utils/textValues";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import FormTextField from "@/Components/TextField/TextField";
import SubmitButton from "@/Components/SubmitButton/SubmitButton";

function receiveToken() {
    const router = useRouter();
    const [initialValues, setInitialValues] = useState({ email: '', password: '' })
    const [validationSchema, setValidationSchema] = useState({
        email: Yup.string().email('Invalid email address').required('Email is required')
    })

    const [state, setState] = useState({
        emailSent: false, email: { value: '', errMsg: '' }, message: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    /*   useEffect(() => {
          router.prefetch('/input-token')
      }, []) */

    const handleSubmit = (values) => {
        updateState({ message: '' })

        return getRequestHandler({
            route: `/api/token-request/?email=${values.email}`,
            successCallback: body => {
                const result = body?.result;
                if (result === true) {
                    console.log('mail sent')
                    router.push(`/link-sent?email=${values.email}`);
                }
                else {
                    console.log('mail not sent')
                    updateState({ message: body?.error })
                }
            },
            errorCallback: err => {
                console.log('Something went wrong')
            }
        })
    }


    const label = ({ label, fontWeight, fontSize, align, mb, color }) => {
        return <Typography sx={{
            color: color ?? '#333333', textAlign: align ?? 'left', mb: mb,
            fontWeight: fontWeight ?? 700, fontSize: fontSize ?? { xs: 12, md: 14 }, lineHeight: '20px'
        }}>
            {label}
        </Typography>
    }

    return (
        <Box align='center' sx={{ maxWidth: '100%', mx: 'auto' }}>
            {label({
                label: textValues.receiveToken.enterEmail,
                fontSize: { xs: 14, md: 13, }, fontWeight: 400, mb: 2, align: 'center'
            })}

            {state.message && label({ label: state.message, color: 'primary.main', align: 'center' })}

            <Formik
                initialValues={initialValues}
                validationSchema={() => Yup.object(validationSchema)}
                onSubmit={handleSubmit}>
                {(formProps) => (
                    <Form>
                        <Box sx={{ mb: 3, mt: 1 }}>
                            <FormTextField type='email' name='email' placeholder={textValues.login.email} />
                        </Box>

                        <SubmitButton label={textValues.receiveToken.proceed} formProps={formProps} />
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default receiveToken;