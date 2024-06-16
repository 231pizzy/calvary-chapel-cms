'use client'

import { getRequestHandler } from "@/Components/requestHandler";
import { textValues } from "@/utils/textValues";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function PasswordChanged() {
    const router = useRouter();

    const email = useSearchParams().get('email');

    const [state, setState] = useState({
        message: '', resending: false
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    const leavePage = () => {
        router.replace('/')
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }} >
                <Typography sx={{
                    color: 'grey[500]', mb: 2, textAlign: 'center',
                    fontSize: { xs: 10, sm: 14 },
                }}>
                    {textValues.passwordChanged.description}
                </Typography>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button id='resendToken' variant="contained" sx={{
                        mb: 1, right: 0, fontWeight: 600, fontSize: 12, width: '60%', borderRadius: '16px',
                        lineHeight: '24.51px'
                    }} onClick={leavePage}>
                        {textValues.passwordChanged.button}
                    </Button>
                </Box>


            </Box>
        </Box >
    );
}
