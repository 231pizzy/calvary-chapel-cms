import { AvatarUploadSvg, CameraSvg, FileUploadFolderSvg, RoundAvatarSvg } from "@/public/icons/icons";
import imageFromFile from "@/utils/imageFromFile";
import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";
import FieldLabel from "../FieldLabel/FieldLabel";

export default function AvatarUpload({ handleChange, fileHeight, fileWidth, maxSize,
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

    return <Box sx={{ width: '100%', height: '100%' }}>
        <Dropzone onDrop={handleFiles} multiple={multiple} accept={accept}>
            {({ getRootProps, getInputProps, isDragActive }) =>
                <Box  {...getRootProps()} sx={{
                    border: round ? 'none' : isDragActive ? '2px dashed #BF0606' : '2px dashed rgba(28, 29, 34, 0.3)', height: '100%',
                    borderRadius: '16px', bgcolor: round ? 'transparent' : isDragActive ? 'rgba(191, 6, 6, 0.08)' : '#E6F1FF',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center',
                    ...(!round && !multiple && fileArray?.length ? {
                        backgroundImage: `url(${getImage()})`,
                        backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                    } : {})
                }}>  {(fileArray?.length > 0 && !round) ?
                    <Box sx={{
                        display: 'flex', ml: 'auto', mb: 'auto', mt: 0, px: 1, py: .5, borderRadius: '0 16px 0 0',
                        maxWidth: '100%', alignItems: 'center', bgcolor: '#34343480',
                    }}>
                        <CameraSvg style={{ height: '20px', width: '20px' }} />
                        <Typography sx={{ fontSize: 12, ml: 2, color: 'white' }}>
                            Click to change image
                        </Typography>
                    </Box>
                    : <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Upload icon */}
                        {round ? (!multiple && fileArray?.length) ? <Avatar
                            src={`${getImage()}`} sx={{ height: '70px', width: '70px' }}
                        /> : <RoundAvatarSvg style={{ height: '70px', width: '70px', marginBottom: '12px' }} /> :
                            <AvatarUploadSvg style={{ height: '70px', width: '70px', marginBottom: '12px' }} />}

                        {/* Label */}
                        <Box sx={{
                            display: 'flex', justifyContent: 'center', px: 2, flexDirection: round ? 'row' : 'column',
                            flexWrap: 'wrap', alignItems: 'center', my: 1,
                        }}>
                            {/* click to upload label */}
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                Add Image
                            </Typography>

                            <Typography sx={{ fontSize: 12, ml: .5, color: 'primary.main' }}>
                                (Optional)
                            </Typography>
                        </Box>
                    </Box>}
                </Box>
            }
        </Dropzone>

        {error ? (
            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{error}</Typography>
        ) : null}
    </Box>
}