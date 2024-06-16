import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Dropdown({ flexEnd, value, prefix, items = [{ label: '', value: '', color: '' }],
    label = "Page", handleItemClick = (id) => { } }) {

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(null);

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleClick = (event) => {
        const id = event.target?.id
        if (id) {
            setSelected(items.find(item => item.value?.toString() === id?.toString())?.label)
            setOpen(false)
            handleItemClick(id)
        }
    }

    useEffect(() => {
        !value && (typeof value !== 'string') && setSelected(null)
    }, [value])

    useEffect(() => {
        value && setSelected(items.find(item => item.value === value)?.label)
    }, [])

    useEffect(() => {
        const removeDropdown = (event) => {
            const currTargetId = event?.currentTarget?.id;
            const targetId = event?.target?.id;
            console.log('clicked id', currTargetId, targetId,);

            if (!document.getElementById('dropdown-content')?.contains(event.target)) {

                handleClose()
            }
        }

        if (open) {
            document.addEventListener('click', removeDropdown)
        }
        else {
            try {
                document.removeEventListener('click', removeDropdown)
            } catch (error) {
                console.log('no listener')
            }
        }

        return () => {
            try {
                document.removeEventListener('click', removeDropdown)
            } catch (error) {
                console.log('no listener')
            }
        }
    }, [open])

    console.log('selected in drop down', selected)


    return <div style={{ position: 'relative', width: 'max-content' }}>
        <div style={{
            backgroundColor: '#F6F6F6', color: 'black', padding: '0 12px', position: 'relative', cursor: 'pointer',
            minWidth: 'max-content', display: 'flex', alignItems: 'center', minHeight: '30px', maxHeight: '50px',
            border: '1px solid #1414171A', borderRadius: '4px'
        }} onClick={open ? handleClose : handleOpen}>
            <Typography sx={{ fontSize: 11, mr: .5, maxWidth: '500px', display: 'flex', alignItems: 'center' }}>
                {prefix && `${prefix} :`} <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'primary.main', ml: prefix ? .5 : 0 }}>
                    {selected ?? label}
                </Typography>
            </Typography>

            {open ? <svg width="9" height="9" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.74184 1.09431C7.40318 0.301895 8.59682 0.301894 9.25816 1.09431L15.5979 8.69054C16.5192 9.79451 15.7554 11.5 14.3397 11.5L1.6603 11.5C0.244553 11.5 -0.519218 9.79451 0.402138 8.69054L6.74184 1.09431Z" fill="#8D8D8D" />
            </svg>
                : <svg width="9" height="9" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.25816 10.9057C8.59682 11.6981 7.40318 11.6981 6.74184 10.9057L0.402137 3.30946C-0.51922 2.20549 0.244552 0.5 1.6603 0.5H14.3397C15.7554 0.5 16.5192 2.20549 15.5979 3.30946L9.25816 10.9057Z" fill="#8D8D8D" />
                </svg>}


            {open && <div id='dropdown-content' style={{
                position: 'absolute', top: '40px', zIndex: 12121223232, borderRadius: '12px', border: '1px solid #BFBFBF',
                backgroundColor: 'white', left: 0, width: '100%', minWidth: 'max-content', maxHeight: '300px', overflowY: 'auto'
            }}>
                {items.map((item, index) => {
                    return <Typography key={index} id={item.value}
                        sx={{
                            px: 1.5, py: .5, fontSize: 11, cursor: 'pointer',
                            borderBottom: '1px solid #DEDEDE', maxWidth: '100%', background: '#FAFAFA',
                        }} onClick={handleClick}>
                        {item.label}
                    </Typography>
                })}
            </div>}
        </div>

    </div>
}