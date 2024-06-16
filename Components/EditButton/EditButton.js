import { EditBoxSvg } from "@/public/icons/icons";
import { Button } from "@mui/material";

export default function EditButton({ url, dark = true, variant = 'contained' }) {
    return <Button href={url} variant={variant}
        sx={{
            borderRadius: '8px', bgcolor: dark ? '#0E60BF' : '#E6F1FF', color: dark ? 'white' : '#0E60BF',
            fontSize: '12px', px: 1, py: .5
        }}>
        <EditBoxSvg style={{ marginRight: '8px', color: dark ? 'white' : '#0E60BF' }} />
        Edit
    </Button>
}