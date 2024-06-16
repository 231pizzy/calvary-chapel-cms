import { Box, } from "@mui/material";

export default function Loader() {
    return <Box sx={{ display: 'flex', maxWidth: '100%', mt: 5, justifyContent: 'center' }}>
        <img src='/images/loader2.gif' style={{ height: '50px', width: '50px' }} />
    </Box>
}