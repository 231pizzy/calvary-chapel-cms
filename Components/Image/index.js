import { Avatar } from "@mui/material";

export default function Image({ onclick, variant = 'circular', diameter, url, style = {} }) {
    return <Avatar variant={variant} onClick={onclick} sx={{
        width: diameter, height: diameter, ...style
    }} src={url} />
}