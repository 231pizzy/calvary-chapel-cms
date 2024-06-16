import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import imageFromFile from "@/utils/imageFromFile";
import IndexView from "../IndexView/IndexView";

export default function Preview({ handleClose, handleSubmit, allowPublish, formProps }) {
    const formData = formProps.values;

    const getImage = (id) => {
        return formData[id] && imageFromFile({ file: Object.values((formData[id] ?? [{}])[0])[0] })
    }

    return <Modal open onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: { xs: '90%', md: '80%' }, m: 'auto', bgcolor: 'white' }}>
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
            <IndexView preview={true}
                previewPayload={{
                    ...formData, banner: getImage('banner'), bodyImage: getImage('bodyImage')
                }}
            />
        </Box>
    </Modal>
}