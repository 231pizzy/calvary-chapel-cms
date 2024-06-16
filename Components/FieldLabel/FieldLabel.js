import { Typography } from "@mui/material";
import Label from "../Label/Label";

export default function FieldLabel({ label, postFix, required = true }) {
    return <Label
        label={label}
        color={'#282828'}
        postFix={postFix}
        type="heading4"
        style={{ mr: .5 }}
        containerStyle={{ mb: 1 }}
        iconRight={<Typography sx={{ color: required ? 'red' : '#0E60BF', fontSize: 12 }}>
            {required ? '*' : 'Optional'}
        </Typography>}
    />
}