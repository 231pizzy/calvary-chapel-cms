import { ArrowDropDown, ArrowDropUp, } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Dropdown({ items, placeholder, selectedItem, handleChange }) {

    const [showOptions, setShowOptions] = useState(false)

    const openMenu = () => {
        console.log('open menu clicked')
        setShowOptions(true)
    }

    useEffect(() => {
        const payload = (e) => {
            console.log('event triggerd')
            if (!document.getElementById('dropdown-in-cms').contains(e.target)) {
                console.log('closing dropdown')
                setShowOptions(false)
            }
        }

        showOptions && document.addEventListener('click', payload)

        return () => {
            document.removeEventListener('click', payload)
        }
    }, [showOptions])



    return <Box id='dropdown-in-cms' sx={{
        width: '100%', display: 'flex', flexDirection: 'column',
    }}>
        {/* Heading */}
        <Box sx={{
            width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer',
            bgcolor: selectedItem ? 'white' : '#F4F4F4', py: .1, border: '1.5px solid #E3E3E3'
        }} onClick={openMenu}>
            <Typography sx={{ ml: 2, fontSize: 15 }}>
                {selectedItem ? items?.find(i => i?.value === selectedItem)?.component : placeholder}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />

            {showOptions ? <ArrowDropUp sx={{ mr: 2, color: '#0E60BF' }} /> :
                <ArrowDropDown sx={{ mr: 2, color: '#0E60BF' }} />}
        </Box>

        {/* Items */}
        {showOptions && <Box sx={{
            maxWidth: '100%', maxHeight: '40vh', overflowY: 'auto', overflowX: 'hidden',
            boxShadow: '0px 6.666666507720947px 13.333333015441895px 0px #0000000F',
            border: '0.83px solid #1414171A', mt: 1
        }}>
            {items?.map((item, index) => {
                return <Box key={index}
                    sx={{ width: '100%', cursor: 'pointer', borderBottom: '1px solid #1414171A' }}
                    onClick={() => { handleChange(item?.value); setShowOptions(false) }}>
                    {item?.component}
                </Box>
            })}
        </Box>}

    </Box>
}