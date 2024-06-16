import { Avatar, Box, Typography } from "@mui/material"

export default function DropdownItemsBuilder({ items, capitalize, postFix }) {
    return items.map((item, index) => {
        return {
            value: item?.link ?? item?.value, component: <Box key={index} sx={{
                display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer',
                ":hover": { backgroundColor: '#F5F5F5' },
                py: 1,
            }}>
                {item?.icon && <Box sx={{ minwidth: 'max-content', px: 1.5, minHeight: 'max-content', display: 'flex', alignItems: 'center' }}>
                    {item?.icon}
                </Box>}
                {item?.image && <Avatar
                    src={item?.image}
                    sx={{ width: 30, height: 30, mx: 2 }}
                />}
                <Typography sx={{
                    textTransform: capitalize ? 'capitalize' : 'inherit',
                    fontSize: 14, px: (!item?.icon && !item?.image) ? 1 : 0, color: 'black'
                }}>
                    {item?.label} {postFix}
                </Typography>

            </Box>
        }
    })
}