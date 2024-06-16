'use client'

import { getRequestHandler } from "@/Components/requestHandler";
import { textValues } from "@/utils/textValues";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


function SendingToken() {
    const router = useRouter();

    const email = useSearchParams().get('email');

    const [state, setState] = useState({
        message: '', resending: false
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    useEffect(() => {
        router.prefetch('/new-password')
    }, [])

    const handleSendAgain = (event) => {
        updateState({ message: '', resending: true })

        getRequestHandler({
            route: '/api/resend-token',
            successCallback: body => {
                const result = body.result;
                let message = '';
                if (result) {
                    console.log('email sent', result);
                    message = 'A new mail has been sent'
                }
                else {
                    console.log('email not sent', result)
                    message = 'Could not send the Email again. Try again later'
                }
                updateState({ message: message, resending: false })
            },
            errorCallback: err => {
                console.log('something went wrong', err);
                updateState({ message: 'Try again later', resending: false })
            }
        })
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography sx={{
                    color: 'grey[500]', mb: 2, textAlign: 'center',
                    fontSize: { xs: 10, sm: 14 },
                }}>
                    {textValues.linkSent.instruction} <b>{email}</b>
                </Typography>

                {Boolean(state.message) && <Typography sx={{ color: 'green', fontSize: 12 }}>
                    {state.message}
                </Typography>}

                <Typography sx={{ fontSize: 12, mt: 3, mb: 1, color: '#282828' }}>
                    Didn’t receive the email? check your spam folder or
                </Typography>

                <Button id='resendToken' variant="contained" sx={{
                    mb: 1, right: 0, fontWeight: 600, fontSize: 12,
                    lineHeight: '24.51px'
                }} disabled={state.resending}
                    onClick={handleSendAgain}>
                    {state.resending && <CircularProgress id='resendToken' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}
                    Resend Email
                </Button>

            </Box>
        </Box >
    );
}

export default SendingToken;