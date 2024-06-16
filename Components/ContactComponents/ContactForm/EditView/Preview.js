import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import SubmitButton from "@/Components/SubmitButton/SubmitButton";
import imageFromFile from "@/utils/imageFromFile";
import IndexView from "../IndexView/IndexView";

export default function Preview({ handleClose, locations, topics, handleSubmit, allowPublish, formProps }) {
    const formData = formProps.values;

    const getImage = (id) => {
        return formData[id] && imageFromFile({ file: Object.values((formData[id] ?? [{}])[0])[0] })
    }

    const getAddressLink = () => {
        console.log('locations', locations);

        const coordinate = locations?.find(i => i?.id === formData?.address)?.coordinate

        // if (!long) return ''
        //const x = //`sdssrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2047.3438091069563!2d7.434218762423025!3d9.063205061040465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e752535045a6d%3A0x1ed6d853ab717f44!2sPCRC%20National%20Secretariat!5e0!3m2!1sen!2sng!4v1703597552591!5m2!1sen!2sng"`
        /* if (link?.startsWith('http')) return link;
        const startIndex = link.indexOf('src="')
        const endIndex = link.indexOf('"', startIndex + 8)
        const url = link.substring(startIndex + 5, endIndex)
        console.log('index of the src', { startIndex, endIndex, url }) */

        const url = `https://www.google.com/maps?q=${coordinate?.lat},${coordinate?.lng}`

        console.log('url', url)

        // formProps.setFieldValue('addressLink', url)

        return url
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
                    ...formData, banner: getImage('banner'),
                    topics: topics?.map(i => { return { _id: i?.value, title: i?.label } }),
                    addressLink: getAddressLink(),
                    coordinate: locations?.find(i => i?.id === formData?.address)?.coordinate,
                    address: locations?.find(i => i?.id === formData?.address)?.address
                }}
            />
        </Box>
    </Modal>
}