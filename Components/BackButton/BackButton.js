'use client'

import { Box, Button, Typography } from "@mui/material";
import BackArrow from '@mui/icons-material/West'
import { useRouter } from "next/navigation";

export default function BackButton({ title, components = [] }) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return <Box sx={{
        display: 'flex', alignItems: 'center', px: 2, py: .5, justifyContent: 'space-between',
        bgcolor: '#F5F5F5', maxWidth: '100%', position: 'static', top: '5px'
    }}>
        <Button onClick={handleBack} sx={{ fontSize: 12, px: 1, py: .5, }}>
            <BackArrow sx={{ color: 'primary.main', fontSize: 17, mr: 1 }} />
            Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        <Typography sx={{ fontSize: 16, mr: 10 }}>
            {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {components?.map((item, index) => {
            return <Box key={index}>
                {item}
            </Box>
        })}

    </Box>
}