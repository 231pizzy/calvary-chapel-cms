
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";

export default function RadioList({ items, wrap, handleChange, ...props }) {
    const [field, meta, helpers] = useField(props);

    const handleSelect = (value) => {
        handleChange ? handleChange(value) : helpers.setValue(value)
    }

    return <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: { xs: 'wrap', lg: wrap ? 'wrap' : 'nowrap' } }}>
            {items?.map((item, index) => {
                return <Box key={index} sx={{
                    display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer', borderRadius: '4px',
                    px: 2, py: 1, mr: 1, border: '1px solid #1414171A', width: wrap ? 'max-content' : '100%',
                    ":hover": { background: '#E6F1FF' }
                }}
                    onClick={() => { handleSelect(item?.value) }}>
                    {meta.value === item?.value ? <RadioButtonChecked sx={{ color: 'primary.main' }} />
                        : <RadioButtonUnchecked sx={{ color: '#8D8D8D' }} />}
                    <Typography sx={{ fontSize: 14, fontWeight: 500, ml: 1 }}>
                        {item?.label}
                    </Typography>
                </Box>
            })}
        </Box>
        {/* meta.touched && */ meta.error ? (
            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{meta.error}</Typography>
        ) : null}
    </Box>
}