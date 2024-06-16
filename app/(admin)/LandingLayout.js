'use client'

import CMSLayout from "@/Components/CMSLayout";
//import AuthBrowser from "@/Components/AuthBrowser";
import Header from "@/Components/Header";
import SideBar from "@/Components/SideBar";
//import NotificationChannel from "@/Components/notification";
//import store from "@/Components/redux/store";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
//import { Provider, } from "react-redux";

export default function LandingLayout({ children }) {
    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, menuOpen: false,
    });

    useEffect(() => {
        updateState({
            isMobile: window.innerWidth < 900,
            darkMode: localStorage.getItem('theme') === 'dark' ? true : false
        })


    }, [])

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    const changeTheme = () => {
        const darkMode = !state.darkMode
        updateState({ darkMode: darkMode })
        localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }

    const closeMenu = () => {
        updateState({ menuOpen: false })
    }

    const toggleMenu = () => {
        updateState({ menuOpen: !state.menuOpen })
    }

    let theme = useMemo(() => {
        return createTheme({
            typography: {
                button: {
                    textTransform: 'none',
                },
                fontFamily: 'Manrope'
            },
            palette: {
                mode: state.darkMode ? 'dark' : 'light',
                primary: { main: '#0E60BF' },
                secondary: { main: '#E8F2FF' }
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        contained: {
                            backgroundColor: '#0E60BF',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#0E60BF32',
                                color: 'black'
                            }
                        },
                        outlined: {
                            backgroundColor: '#E6F1FF',
                            color: '#0E60BF',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#E6F1FF12',
                                color: '#0E60BF'
                            }
                        },
                        text: {
                            color: '#0E60BF',
                            '&:hover': {
                                backgroundColor: '#C6DEFF'
                            }

                        }
                    }
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            color: 'black',
                            '&.Mui-selected': {
                                borderRight: '2px solid #0E60BF',
                                color: '#0E60BF'
                            }
                        }
                    }
                }
            }
        })
    }, [])



    return <ThemeProvider theme={theme}>
        <Box sx={{ width: '100vw' }}>
            {children}
        </Box>
    </ThemeProvider>
}