
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useField } from "formik";

export default function CheckboxWithoutTextFieldList({ items, valueKey, ...props }) {
    const [field, meta, helpers] = useField(props);

    const handleSelect = (value) => {
        const newValue = meta.value?.find(i => i?.id === value) ? meta.value?.filter(i => i?.id !== value) : [...(meta.value ?? []), { id: value }]
        helpers.setValue(newValue)
    }

    return <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {items?.map((item, index) => {
                const isSelected = Boolean(meta.value?.find(i => i?.id === item?.value));

                return <Box key={index} sx={{
                    display: 'flex', alignItems: 'center', mb: 2, mx: 1, cursor: 'pointer', ":hover": { backgroundColor: 'white' },
                    bgcolor: '#F5F9FF', py: 1, px: 1, border: '1px solid #1414171A', width: '30%', flexDirection: 'column'
                }} >
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                        onClick={() => { handleSelect(item?.value) }}>
                        {isSelected ?
                            <CheckBox sx={{ color: 'primary.main' }} />
                            : <CheckBoxOutlineBlank sx={{ color: '#1414171A' }} />}

                        <Typography sx={{ fontSize: 14, fontWeight: 400, ml: 2 }}>
                            {item?.label}
                        </Typography>
                    </Box>
                </Box>
            })}

        </Box>
        {meta.touched && meta.error ? (
            <Typography sx={{ color: 'red', fontSize: 11, px: 2, mt: 0, mb: 1 }}>{meta.error}</Typography>
        ) : null}
    </Box>
}