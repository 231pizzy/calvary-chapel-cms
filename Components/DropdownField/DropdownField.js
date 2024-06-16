import { ArrowDropDown, ArrowDropUp, ArrowUpward, KeyboardArrowUp, MoveUp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";
import { useEffect, useState } from "react";

export default function DropdownField({ items, placeholder, selectedItem, handleChange, ...props }) {
    const [field, meta, helpers] = useField(props);

    const [showOptions, setShowOptions] = useState(false)

    const openMenu = () => {
        setShowOptions(true)
    }

    useEffect(() => {
        const payload = (e) => {
            console.log('event triggerd')
            if (!document.getElementById('dropdown-in-cms').contains(e.target)) {
                setShowOptions(false)
            }
        }

        showOptions && document.addEventListener('click', payload)

        return () => {
            document.removeEventListener('click', payload)
        }
    }, [showOptions])


    console.log('selected Item ', selectedItem);


    return <Box sx={{
        width: '100%', display: 'flex', flexDirection: 'column',
    }}>
        {/* Heading */}
        <Box sx={{
            width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer',
            bgcolor: (selectedItem || typeof selectedItem === 'number') ? 'white' : '#F4F4F4', py: 1, border: '1.5px solid #E3E3E3'
        }} onClick={openMenu}>
            <Typography sx={{ ml: 2, fontSize: 15 }}>
                {(selectedItem || typeof selectedItem === 'number') ? items?.find(i => i?.value === selectedItem)?.component : placeholder}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />

            {showOptions ? <ArrowDropUp sx={{ mr: 2, color: '#0E60BF' }} /> :
                <ArrowDropDown sx={{ mr: 2, color: '#0E60BF' }} />}
        </Box>

        {/* Items */}
        {showOptions && <Box id='dropdown-in-cms' sx={{
            maxWidth: '100%', maxHeight: '40vh', overflowY: 'auto', overflowX: 'hidden',
            boxShadow: '0px 6.666666507720947px 13.333333015441895px 0px #0000000F',
            border: '0.83px solid #1414171A', mt: 2
        }}>
            {items?.map((item, index) => {
                return <Box key={index}
                    sx={{ width: '100%', borderBottom: '1px solid #1414171A' }}
                    onClick={() => { handleChange(item?.value); setShowOptions(false) }}>
                    {item?.component}
                </Box>
            })}
        </Box>}

        {/* meta.touched && */ meta.error ? (
            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{meta.error}</Typography>
        ) : null}
    </Box>
}