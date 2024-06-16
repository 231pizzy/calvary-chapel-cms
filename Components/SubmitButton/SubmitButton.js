import { Button, CircularProgress } from "@mui/material";

export default function SubmitButton({ formProps, label, disabled, fullWidth = true, marginTop = 2, variant = 'contained' }) {
    return <div style={{
        width: fullWidth ? '100%' : 'max-content', alignItems: 'center',
        display: 'flex', justifyContent: 'center'
    }}>
        <Button id='loginSubmit' type="submit"
            onClick={async () => { await formProps?.submitForm() }}
            disabled={disabled || formProps.isSubmitting}
            fullWidth variant={variant} sx={{
                mt: marginTop, fontWeight: 400, mx: 'auto', fontSize: 14, borderRadius: '16px',
                maxWidth: fullWidth ? '60%' : 'max-content',
            }} >
            {formProps.isSubmitting && <CircularProgress id='loginSubmit' size={20}
                sx={{ mr: 2, color: '#08e8de' }} />}
            {label}
        </Button>
    </div>
}