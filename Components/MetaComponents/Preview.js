import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import SubmitButton from "@/Components/SubmitButton/SubmitButton";

export default function Preview({ handleClose, formProps }) {
    const formData = formProps.values;

    return <Modal open onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: { xs: '90%', md: '80%' }, m: 'auto', height: '80vh', bgcolor: 'white' }}>
            {/* Heading */}
            <Box sx={{
                display: 'flex', alignItems: 'center', py: 1, px: 1, mx: 'auto',
                justifyContent: 'space-between', maxWidth: '100%', borderBottom: '1px solid #1414171A'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Close button */}
                    <IconButton onClick={handleClose} sx={{ p: 0, border: 'none' }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography sx={{ fontSize: 17, ml: 2, color: 'primary.main', fontWeight: 700 }}>
                        Preview
                    </Typography>
                </Box>


                {/* Publish button */}
                {<SubmitButton fullWidth={false} marginTop={0} label={'Publish'} formProps={formProps} />}
            </Box>

            {/* Content */}
            <Box sx={{
                display: 'flex', flexDirection: 'column', boxShadow: '0px 8px 16px 0px #0000000F',
                border: '1px solid #1414171A', borderRadius: '12px', py: 1, px: 1, mt: 4, width: '60%', ml: 6
            }}>
                <Typography sx={{ color: 'primary.main', fontSize: 15, mb: 1, fontWeight: 500 }}>
                    {formData?.title}
                </Typography>

                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {formData?.description}
                </Typography>
            </Box>
        </Box>
    </Modal>
}