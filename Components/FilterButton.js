import { FilterSvg } from "@/public/icons/icons"
import { Button } from "@mui/material"

export const FilterButton = ({ handleOpenFilter }) => {
    return <Button onClick={handleOpenFilter} variant='outlined'
        sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1.5, py: .5, fontSize: 12 }}>
        Filter  <FilterSvg style={{ height: '15px', width: '15px', marginLeft: '8px' }} />
    </Button>
}