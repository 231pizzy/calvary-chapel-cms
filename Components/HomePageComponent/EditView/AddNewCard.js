import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import { Box, Button } from "@mui/material"

export default function AddNewCard({ showCardTypes, setShowCardTypes, addCard, formProps }) {
    return <Box sx={{
        position: 'relative', maxWidth: 'max-content', height: 'max-content',
        display: 'flex', flexDirection: 'column', ml: 'auto', mr: 1, zIndex: 33
    }}
        onMouseEnter={() => { setShowCardTypes(true) }} onMouseLeave={() => { setShowCardTypes(false) }}>
        <Button variant="text" sx={{ fontSize: 12, fontWeight: 600, }}
        >
            + Add New Card
            {showCardTypes ? <ArrowDropUp sx={{ ml: .5, color: '#0E60BF' }} /> :
                <ArrowDropDown sx={{ ml: .5, color: '#0E60BF' }} />}
        </Button>

        {showCardTypes && <Box sx={{
            maxWidth: '100%', position: 'absolute', top: 34, left: 0, right: 0, bgcolor: 'white',
            display: 'flex', flexDirection: 'column', zIndex: 3232, height: 'max-content',
            borderRadius: '12px', border: '1px solid #1414171A',
            boxShadow: '0px 6.666666507720947px 13.333333015441895px 0px #0000000F',
        }}>
            <Button variant="text" sx={{ fontSize: 11, fontWeight: 600, py: .5, color: 'black', borderBottom: '1px solid #1414171A', }}
                onClick={() => { addCard('internalNavigation', formProps) }}>
                Text Card
            </Button>

            <Button variant="text" sx={{
                fontSize: 11, fontWeight: 600, py: .5, borderBottom: '1px solid #1414171A', color: 'black',
            }}
                onClick={() => { addCard('externalNavigation', formProps) }}>
                Logo Card
            </Button>

            <Button variant="text" sx={{
                fontSize: 11, fontWeight: 600, py: .5, borderBottom: '1px solid #1414171A', color: 'black',
            }}
                onClick={() => { addCard('imageCard', formProps) }}>
                Image Card
            </Button>
        </Box>}
    </Box>

}