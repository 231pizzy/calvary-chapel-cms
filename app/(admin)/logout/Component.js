'use client'

import {
    Box, Button, ButtonGroup, CircularProgress, Modal, Typography,
} from "@mui/material";

const logoutImg = '/images/logout.png'

import { useState } from "react";

import { useRouter } from "next/navigation";
import { getRequestHandler } from "@/Components/requestHandler";
import WarningModal from "@/Components/WarningModal/WarningModal";

export default function LogOut({ showLogOutPrompt, handleCancel }) {
    const router = useRouter();

    const [state, setState] = useState({
        adminProfileData: null, loggingOut: false
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    const handleLogout = (event) => {
        const buttonId = event.target.id;
        updateState({ loggingOut: true });

        getRequestHandler({
            route: '/api/log-out',
            successCallback: body => {
                const result = body.result;
                console.log('logged out', result);
                if (result) {
                    //user has been logged out. Close modal and send them to index page
                    router.replace('/login');

                    handleCancel();
                }
                else {
                    //Log out failed. Show error message
                    stopAnimation(buttonId, dispatch);
                    handleCancel()
                }

                updateState({ loggingOut: false })
            },
            errorCallback: err => {
                console.log('something went wrong', err);
                stopAnimation(buttonId, dispatch);
            }
        })
    }



    return (
        <WarningModal
            open={showLogOutPrompt} handleCancel={handleCancel} title={'Logging Out'}
            message={'You are about to log out from CCTURKU CMS'} proceedAction={handleLogout}
            status={state.loggingOut ? 'submitting' : 'default'}
        />)
    {/* 
        <Modal open={showLogOutPrompt} onClose={handleCancel}>
            <Box sx={{
                width: '300px',
                bgcolor: 'white', p: 4, transform: 'translate(-50%,-50%)',
                position: 'absolute', top: '50%', left: '50%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', }}>
                    <img alt='logout' src={logoutImg} height='100px' />
                </Box>

                <Typography align='center' sx={{
                    my: 4, fontSize: 14, fontWeight: 600,
                    lineHeight: '30px', textTransform: 'uppercase'
                }}>
                    You are about to log out from CCTurku CMS
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button id='logoutProceed' variant='text'
                        sx={{ fontSize: 18, fontWeight: 700, }}
                        onClick={handleLogout}
                        disabled={state.loggingOut}>
                        {state.loggingOut && <CircularProgress id='logoutProceed' size={20}
                            sx={{ mr: 2, color: '#08e8de' }} />}
                        Proceed
                    </Button>

                    {!state.loggingOut && <Button variant='text' onClick={handleCancel}
                        sx={{ fontSize: 18, fontWeight: 700, color: '#646464' }}>
                        Cancel
                    </Button>}
                </Box>
            </Box>
        </Modal> */}
} 