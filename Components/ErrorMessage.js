import { Typography } from "@mui/material";

export default function ErrorMessage({ message }) {
    return <Typography sx={{ color: 'red', fontSize: 12, mb: 1, maxWidth: '90%' }}>
        {message}
    </Typography>
}