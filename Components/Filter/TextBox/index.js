import { OutlinedInput } from "@mui/material"

export default function TextBox({ data, item, finalFilter, handleChange }) {
    return <div style={{
        /* display: 'flex', flexWrap: 'wrap', */
    }}>
        <OutlinedInput
            value={finalFilter[item?.value]?.filter ?? ''}
            placeholder={item?.label}
            sx={{
                height: '30px', fontSize: 12, py: 1, maxWidth: '100%', border: '.5px solid grey'
            }}
            onChange={(event) => {
                handleChange({
                    type: 'textbox', id: item?.value,
                    filterId: item?.filterId,
                    value: event.currentTarget.value
                })
            }}
        />
    </div>
}