import { AvatarUploadSvg, CameraSvg, FileUploadFolderSvg, RoundAvatarSvg } from "@/public/icons/icons";
import imageFromFile from "@/utils/imageFromFile";
import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";
import FieldLabel from "../FieldLabel/FieldLabel";

export default function ImageUpload({ handleChange, fileHeight, fileWidth, maxSize,
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

    return <Box sx={{ width: '230px', height: '200px' }}>
        <Dropzone onDrop={handleFiles} multiple={multiple} accept={accept}>
            {({ getRootProps, getInputProps, isDragActive }) =>
                <Box  {...getRootProps()} sx={{
                    border: isDragActive ? '2px dashed #BF0606' : '2px dashed rgba(28, 29, 34, 0.3)', height: '100%',
                    borderRadius: '16px', bgcolor: isDragActive ? 'rgba(191, 6, 6, 0.08)' : 'white', position: 'relative',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center',
                    ...(!multiple && fileArray?.length ? {
                        backgroundImage: `url(${getImage()})`,
                        backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                    } : {}), overflow: 'hidden'
                }}>
                    {fileArray?.length > 0 && <Typography sx={{
                        fontSize: 12, ml: 2, position: 'absolute', top: 0, right: 0,
                        color: 'white', bgcolor: 'black', px: 1, py: .5
                    }}>
                        Click to Change image
                    </Typography>}
                    {!fileArray?.length && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Upload icon */}
                        <CameraSvg style={{ height: '40px', width: '40px', marginBottom: '4px' }} />

                        <Typography sx={{ fontSize: 12, fontWeight: 600, mb: .5 }}>
                            Click to upload image
                        </Typography>

                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey', opacity: '50%', fontWeight: 600 }}>
                            Image Size 300px by 300px
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