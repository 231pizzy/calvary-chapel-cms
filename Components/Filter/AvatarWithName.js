import generateFileUrl from '@/utils/getImageUrl'
import { Avatar, Box, Typography } from '@mui/material'

export default function AvatarWithName(props) {

    return <Box sx={{
        display: 'flex', alignItems: 'center',
        height: '100%'
    }}>
        <Avatar
            src={generateFileUrl(props?.value?.image)}
            sx={{ height: '20px', width: '20px' }}
            css={{}}
        />

        <Typography sx={{ fontSize: 13 }}>
            {props?.value?.name}
        </Typography>
    </Box>
}