import { Box, OutlinedInput, TextField, Typography } from "@mui/material";
import { useField } from "formik"

import dynamic from 'next/dynamic'
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';


const ReactQuillNoSSR = dynamic(() => import('react-quill'), { ssr: false })

export default function FormTextArea({ placeholder, plain, maxLength, rows, variant = 'outlined', ...props }) {
    const [field, meta, helpers] = useField(props);

    const [length, setLength] = useState(meta?.value?.length ?? 0);

    const handleChange = (value) => {
        helpers.setValue(value)
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', }}>

        {plain
            ? <TextField {...field} {...props} fullWidth variant={variant} multiline rows={rows ?? 4}
                placeholder={placeholder} sx={{ fontSize: 14, fontWeight: 500, bgcolor: 'white' }}
                onKeyUp={(e) => { setLength(meta.value?.length) }}
                inputProps={{ ...(maxLength ? { maxLength } : {}) }}
            />
            : <ReactQuillNoSSR theme="snow" modules={{
                clipboard: {
                    matchVisual: false
                }
            }}
                {...field} {...props}
                name={field.name}
                onBlur={() => { }}
                placeholder={placeholder}
                onChange={(value) => handleChange(value?.replace(/<a href="www./g, `<a href="https://www.`))}
                style={{
                    borderTop: '1px solid black', display: 'flex',
                    flexDirection: 'column-reverse', width: '100%'
                }}
            />}

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

            {meta.touched && meta.error ? (
                <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{meta.error}</Typography>
            ) : null}

            {maxLength && <Typography sx={{
                fontSize: 12, mt: 1, alignSelf: 'flex-end'
            }}>{length}/{maxLength}</Typography>}

        </Box>

    </Box>
}