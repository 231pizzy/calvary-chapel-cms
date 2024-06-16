import { Typography } from "@mui/material";
import Label from "../Label/Label";

export default function FieldValue({ label, color, required = true }) {
    return <Label
        label={label}
        color={color ?? '#282828'}
        type="heading4"
        style={{ mr: .5 }}
        containerStyle={{ mb: 1 }}
    />
}