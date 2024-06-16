import { CameraSvg, FileUploadFolderSvg } from "@/public/icons/icons";
import imageFromFile from "@/utils/imageFromFile";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";

export default function FileUpload({ handleChange, fileHeight, fileWidth, maxSize, aspectRatio,
    multiple, accept, extensionArray, showFiles, viewUploadedContact, removeContact,
    fileArray, saveName, filenameIsEditable, error, height, width }) {

    // const [fileArray, setFileArray] = useState(null)

    const handleFiles = (files) => {
        const fileArray = Array.from(files).map(file => {
            return { [file.name]: file }
        })
        handleChange(fileArray)

    }

    const getImage = (id) => {
        return imageFromFile({ file: Object.values((fileArray ?? [{}])[0])[0] })
    }

    return <Box sx={{ width, height }}>
        <Dropzone onDrop={handleFiles} multiple={multiple} accept={accept}>
            {({ getRootProps, getInputProps, isDragActive }) =>
                <Box  {...getRootProps()} sx={{
                    border: isDragActive ? '2px dashed #BF0606' : '2px dashed rgba(28, 29, 34, 0.3)', height: '100%',
                    borderRadius: '16px', bgcolor: isDragActive ? 'rgba(191, 6, 6, 0.08)' : '#F8F8F8',
                    height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '100%', justifyContent: 'center',
                    ...(!multiple && fileArray?.length ? {
                        backgroundImage: `url(${getImage()})`,
                        backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                    } : {}),
                }}>
                    {fileArray?.length > 0 ?
                        <Box sx={{
                            display: 'flex', ml: 'auto', mb: 'auto', mt: 0, px: 1, py: .5, borderRadius: '0 16px 0 0',
                            maxWidth: 'max-conent', alignItems: 'center', bgcolor: '#34343480',
                        }}>
                            <CameraSvg style={{ height: '20px', width: '20px' }} />
                            <Typography sx={{ fontSize: 12, ml: 2, color: 'white' }}>
                                Click to Change image
                            </Typography>
                        </Box>
                        : <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Upload icon */}
                            <FileUploadFolderSvg style={{ height: '70px', width: '70px', marginBottom: '12px' }} />
                            {/* First row */}
                            <Box sx={{
                                display: 'flex', justifyContent: 'center', px: 2, wordBreak: 'break-all',
                                flexWrap: 'wrap', alignItems: 'center', mb: 1, maxWidth: '80%', whiteSpace: 'normal'
                            }}>
                                {/* click to upload label */}
                                <Typography component='label'
                                    sx={{
                                        cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center',
                                        color: 'primary.main', mr: .5, textDecoration: 'underline'
                                    }}>
                                    Click to here add image
                                </Typography>
                                {/* Other part of label */}
                                <Typography sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                                    or drag and drop file
                                </Typography>
                            </Box>

                            {/* Second row: allowed file extensions */}
                            <Typography sx={{
                                fontSize: 12, fontWeight: 500, color: '#898989', whiteSpace: 'normal', maxWidth: '80%', textAlign: 'center',
                                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'
                            }}>
                                Image format must be one of {extensionArray.join(', ')} (size {fileHeight} by {fileWidth}). Maximum file size {maxSize}
                            </Typography>
                        </Box>}
                </Box>
            }
        </Dropzone>

        {error ? (
            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{error}</Typography>
        ) : null}
    </Box>
}