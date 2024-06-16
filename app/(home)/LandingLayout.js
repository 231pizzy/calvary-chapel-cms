'use client'

import { ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import Landing from "./Landing";
import AppContext, { AppContextProvider } from "@/Components/appContext";

export default function LandingLayout({ children }) {
    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, menuOpen: false
    });

    useEffect(() => {
        updateState({ isMobile: window.innerWidth < 900, darkMode: localStorage.getItem('theme') === 'dark' ? true : false })
    }, [])

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
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
        <AppContextProvider>
            <Landing {...{ children: children }} />
        </AppContextProvider>

    </ThemeProvider>
}