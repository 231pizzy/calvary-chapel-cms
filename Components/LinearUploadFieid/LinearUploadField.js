import { UploadSvg } from "@/public/icons/icons";
import { Upload } from "@mui/icons-material";
import { Box, Button, OutlinedInput, Typography } from "@mui/material";
import { useField } from "formik"
import { useState } from "react";

export default function LinearUploadField({ placeholder, handleChange, multiple, accept = [], icon, ...props }) {
    const [field, meta, helpers] = useField(props);

    const [fileData, setFileData] = useState(null)

    const handleFiles = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleChange([{ [file.name]: file }])
            setFileData({ filename: file.name })
        }
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{
            display: 'flex', alignItems: 'center', width: '100%', bgcolor: '#F9F9F9',
            border: '1px solid #1414171A', px: 1, py: 1
        }}>
            {/* Icon */}
            {icon}
            {/* FIle name or placeholder */}
            <Typography sx={{ ml: 1, fontSize: 12 }}>
                {fileData?.filename ? `${fileData?.filename} file` : placeholder}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Upload button */}
            <Typography component={'label'} htmlFor={`file-select-upload-${field.name}`}
                sx={{
                    display: 'flex', color: '#0E60BF', fontSize: 12, cursor: 'pointer',
                    alignItems: 'center', maxWidth: 'max-content'
                }}>
                Upload <UploadSvg style={{ marginLeft: '8px' }} />
                <input type="file" accept={accept?.join(', ')} id={`file-select-upload-${field.name}`} max={50} onChange={handleFiles} style={{ width: '1px', visibility: 'hidden' }} />
            </Typography>

            {/*  <Box sx={{ width: '1px' }}>

            </Box> */}
        </Box>

        {meta.touched && meta.error ? (
            <Typography sx={{ color: 'red', fontSize: 11, mt: 1, }}>{meta.error}</Typography>
        ) : null}
    </Box>
}