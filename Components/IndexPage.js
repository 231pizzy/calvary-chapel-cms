'use client'

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getRequestHandler } from "./requestHandler";

export default function IndexPage() {
    const router = useRouter();

    const [state, setState] = useState({
        networkIssue: false, designation: null, isLoggedIn: false, checkingStatus: true
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        getRequestHandler({
            route: '/api/check-status',
            successCallback: body => {
                const result = body?.result;
                if (result) {
                    updateState({ isLoggedIn: true, networkIssue: false });
                    router.replace('/admin')
                }
                else {
                    updateState({ isLoggedIn: false, networkIssue: false });
                    router.replace('/login')
                }
            },
            errorCallback: err => {
                updateState({ isLoggedIn: false, networkIssue: true, checkingStatus: false })
            }
        });
    }, [])

    return <Box sx={{ mx: 'auto', maxWidth: 'max-content' }}>
        {state.checkingStatus
            ? <CircularProgress />
            : <Typography>
                Please check your network
            </Typography>}
    </Box>
} 