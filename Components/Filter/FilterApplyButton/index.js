import { Box, Button } from "@mui/material";

export default function FilterApplyButton({ handleSubmit }) {
    return <Button
        variant='contained'
        sx={{ maxWidth: 'max-content', mx: 'auto', borderRadius: '24px', mt: 4, mb: 2 }}
        onClick={handleSubmit}
    >
        Show result
    </Button>
}