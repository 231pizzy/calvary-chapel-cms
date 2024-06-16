import { RadioIcon } from "@/public/icons/icons";
import { CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox } from "@mui/icons-material";
import { Box, OutlinedInput, Typography } from "@mui/material";
import { useField } from "formik";

export default function CheckBoxList({ items, valueKey, ...props }) {
    const [field, meta, helpers] = useField(props);

    const handleSelect = (value) => {
        const newValue = meta.value?.find(i => i?.id === value) ? meta.value?.filter(i => i?.id !== value) : [...(meta.value ?? []), { id: value }]
        helpers.setValue(newValue)
    }

    const handleSetTime = (event, id) => {
        const newValue = [...meta.value]
        const index = meta.value?.findIndex(i => i?.id === id)
        newValue[index]['startTime'] = event.currentTarget.value
        helpers.setValue(newValue)
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 4, py: 2 }}>
        {items?.map((item, index) => {
            const isSelected = Boolean(meta.value?.find(i => i?.id === item?.value));

            return <Box key={index} sx={{
                display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', ":hover": { backgroundColor: 'white' },
                bgcolor: '#F5F9FF', py: 1, px: 1, border: '1px solid #1414171A', width: '30%', flexDirection: 'column'
            }} >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                    onClick={() => { handleSelect(item?.value) }}>
                    {isSelected ?
                        <CheckBox sx={{ color: 'primary.main' /* fill: meta.value?.includes(item?.value) ? '#FFB43B' : 'transparent' */ }} />
                        : <CheckBoxOutlineBlank sx={{ color: '#1414171A' /* fill: meta.value?.includes(item?.value) ? '#FFB43B' : 'transparent' */ }} />}

                    <Typography sx={{ fontSize: 14, fontWeight: 400, ml: 2 }}>
                        {item?.label}
                    </Typography>
                </Box>

                {isSelected && <OutlinedInput onChange={(event) => { handleSetTime(event, item?.value) }}
                    value={meta.value?.find(i => i?.id === item?.value)?.startTime} fullWidth
                    type="time" sx={{ fontSize: 14, height: '35px', mt: 2, fontWeight: 500 }}
                />}
            </Box>
        })}

        {meta.touched && meta.error ? (
            <Typography style={{ color: 'red', fontSize: 11, marginTop: '4px' }}>{meta.error}</Typography>
        ) : null}
    </Box>
}