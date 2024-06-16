import { Box, Typography } from "@mui/material"

export default function FilterElement({ rows, data, finalFilter, typeMapping, handleChange, unSelect, selectedItems, siteSettings }) {
    return rows.map((item, indx) => {
        return <Box key={indx} sx={{
            py: 1, maxWidth: '100%'
        }} >
            <Typography sx={{
                color: '#282828', display: 'flex', textTransform: 'capitalize',
                fontSize: 13, mb: 1, fontWeight: 600
            }}>
                Filter by  {item?.label}
            </Typography>
            {typeMapping[item?.type]?.element({ data: data, item: item, finalFilter: finalFilter, unSelect, selectedItems: selectedItems[item?.value], handleChange, siteSettings })}
        </Box>
    })
}