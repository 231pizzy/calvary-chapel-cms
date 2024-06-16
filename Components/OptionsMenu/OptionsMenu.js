import { DeleteSvg, EditPenSvg, MoreSvg } from "@/public/icons/icons"
import { Box, Button, IconButton } from "@mui/material"
import { useState } from "react";

export default function OptionsMenu({ handleEdit, handleDelete, id }) {
    const [openOptions, setOpenOption] = useState(false);

    const closeOptions = () => {
        openOptions && setOpenOption(false)
    }

    return <Box sx={{
        position: 'absolute', top: 6, right: 5, display: 'flex', alignItems: 'flex-end',
        flexDirection: 'column', height: 'max-content', width: 'max-content'
    }} onMouseLeave={closeOptions}>
        <IconButton sx={{ p: 0, alignSelf: 'flex-end', height: 'max-content', width: 'max-content' }}
            onClick={() => { setOpenOption(true) }}>
            <MoreSvg style={{ height: '15px', width: '15px', }} />
        </IconButton>

        {openOptions && <Box sx={{
            display: 'flex', flexDirection: 'column', border: '1px solid #1C1D221A',
            bgcolor: 'white', zIndex: 232323, alignSelf: 'flex-end', borderRadius: '8px',
            boxShadow: '0px 8px 16px 0px #0000000F', alignItems: 'flex-start'
        }} >
            <Button sx={{
                fontSize: 11, color: '#8D8D8D', py: .2, px: 1,
                borderBottom: '1px solid #1C1D221A', width: '100%'
            }} onClick={() => { handleEdit(id) }}>
                <EditPenSvg style={{ marginRight: '8px', height: '12px', width: '12px' }} />Edit
            </Button>
            <Button sx={{ fontSize: 11, py: .2, px: 1, minWidth: 0, color: '#8D8D8D' }}
                onClick={() => { handleDelete(id) }}>
                <DeleteSvg style={{ height: '20px', width: '20px' }} />Delete
            </Button>
        </Box>}
    </Box>
}