import { Box, Typography } from "@mui/material"

import RightIcon from '@mui/icons-material/KeyboardArrowRight';
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
    const path = usePathname();
    const viewsArray = path.split('/');

    // const pathWithoutRoot = [...viewsArray].splice(0, viewsArray.length - 2).join('/')

    console.log('viewsArray', viewsArray);

    return viewsArray[1] && <Box sx={{
        /*  position: 'absolute', top: '30px', left: '30px', */
        display: { xs: 'none', lg: 'flex' }, alignItems: 'center', justifyContent: { xs: 'none', md: 'flex-start' },
        justifySelf: 'flex-start', marginRight: 'auto', px: 6,
    }}>
        {viewsArray.slice(1).map((data, index) => {
            const isLast = index === viewsArray.length - 1
            return <Link href={`${[...viewsArray].splice(0, index + 2).join('/')}`}
                key={index} style={{ textDecoration: 'none', }}>
                <Typography sx={{
                    color: 'white' /* isLast ? 'primary.main' : 'text.secondary' */, display: 'flex', alignItems: 'center',
                    fontSize: 13, fontWeight: isLast ? 500 : 400, cursor: isLast ? 'inherit' : 'pointer'
                }}  >
                    {data || 'home'}
                    {!isLast && <RightIcon fontSize="small" sx={{ mx: .1 }} />}
                </Typography>
            </Link>
        })}
    </Box>
}