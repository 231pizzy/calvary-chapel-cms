import Close from "@mui/icons-material/Close";
import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";

export default function ModalMessage({ title, open, message, proceedAction, status, type = 'danger', handleCancel }) {
    return <Modal open={open} onClose={handleCancel} sx={{
        display: 'flex', alignitems: 'center',
        justifyContent: 'center'
    }}>
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'white', my: 'auto',
            width: { xs: '90vw', sm: '40vw', lg: '30vw' }, borderRadius: '12px', height: 'max-content'
        }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', width: '100%', py: 1,
                borderBottom: '1px solid #1414171A', justifyContent: 'center'
            }}>
                <Typography sx={{
                    color: type === 'danger' ? 'red' : 'primary.main', fontWeight: 600,
                    width: '100%', display: 'flex', justifyContent: 'center'
                }}>
                    {title}
                </Typography>

                <Close sx={{ fontSize: 18, cursor: 'pointer', mr: 1 }} onClick={handleCancel} />
            </Box>

            {/* Message */}
            {(message instanceof String) ? <Typography sx={{ py: 2, px: 2, textAlign: 'center', }}>
                {message}
            </Typography> : <Box sx={{ py: 2, px: 2, textAlign: 'center', }}>
                {message}
            </Box>}
        </Box>
    </Modal>
}