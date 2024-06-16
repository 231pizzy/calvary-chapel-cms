import { AvatarUploadSvg, CameraSvg, FileUploadFolderSvg, RoundAvatarSvg } from "@/public/icons/icons";
import imageFromFile from "@/utils/imageFromFile";
import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";
import FieldLabel from "../FieldLabel/FieldLabel";

export default function IconUpload({ handleChange, fileHeight, fileWidth, maxSize,
    multiple, accept, extensionArray, showFiles, viewUploadedContact, removeContact,
    fileArray, saveName, filenameIsEditable, error, round }) {

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

    return <Box sx={{ width: '120px', height: '100px' }}>
        <Dropzone onDrop={handleFiles} multiple={multiple} accept={accept}>
            {({ getRootProps, getInputProps, isDragActive }) =>
                <Box  {...getRootProps()} sx={{
                    border: isDragActive ? '2px dashed #BF0606' : '2px dashed rgba(28, 29, 34, 0.3)', height: '100%',
                    borderRadius: '16px', bgcolor: isDragActive ? 'rgba(191, 6, 6, 0.08)' : '#E3E3E3',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center',
                    /* ...(fileArray?.length ? {
                        backgroundImage: `url(${getImage()})`,
                        backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                    } : {}) */
                }}>   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Upload icon */}
                        {(fileArray?.length) ? <Avatar
                            src={`${getImage()}`} sx={{ height: '30px', width: '30px' }}
                        /> : <CameraSvg style={{ height: '40px', width: '40px', marginBottom: '4px' }} />}

                        {/* Label */}
                        <Box sx={{
                            display: 'flex', justifyContent: 'center', px: 2, flexDirection: round ? 'row' : 'column',
                            flexWrap: 'wrap', alignItems: 'center',
                        }}>
                            {/* click to upload label */}
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                Upload Logo
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            }
        </Dropzone>

        {error ? (
            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{error}</Typography>
        ) : null}
    </Box>
}