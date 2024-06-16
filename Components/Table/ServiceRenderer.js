import { BibleStudyDynSvg, ChildrenSvgDyn, ConferenceDynSvg, MenSvgDyn, PulpitDynSvg, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import { Typography } from "@mui/material";
import Link from "next/link";

const ServiceRenderer = (props) => {

    const iconStyle = { height: '15px', width: '15px', marginRight: '8px' }
    const serviceList = [
        { label: `Men's Ministry`, icon: <MenSvgDyn style={iconStyle} />, value: 'men-service' },
        { label: `Women's Ministry`, icon: <WomenSvgDyn style={iconStyle} />, value: 'women-service' },
        { label: `Youth's Ministry`, icon: <YouthSvgDyn style={iconStyle} />, value: 'youth-service' },
        { label: `Children's Ministry`, icon: <ChildrenSvgDyn style={iconStyle} />, value: 'children-service' },
        { label: 'Wednesday Service', icon: <BibleStudyDynSvg style={iconStyle} />, value: 'wednesday-service' },
        { label: 'Sunday Service', icon: <PulpitDynSvg style={iconStyle} />, value: 'sunday-service' },
        { label: 'Conferences', icon: <ConferenceDynSvg style={iconStyle} />, value: 'conferences' },
    ];


    const data = serviceList?.find(i => i?.value?.trim() === props?.value?.trim())
    return (
        props?.value === 'conferences'
            ? <Typography sx={{
                color: 'black', fontSize: '12px', display: 'flex', mt: 1, mb: 0, pb: 0, alignItems: 'center'
            }}>
                {props?.data?.conference}
            </Typography>
            : <Typography sx={{
                color: 'black', fontSize: '12px', display: 'flex', mt: 1, mb: 0, pb: 0, alignItems: 'center'
            }}>
                {data?.icon}  {data?.label || '--------'}
            </Typography>
    );
}

export default ServiceRenderer