import { AudioDownloadSvg, AudioSvg, BibleStudyDynSvg, ChildrenSvgDyn, ConferenceDynSvg, DocumentDownloadSvg, DownloadSvg, MenSvgDyn, PdfSvg, PulpitDynSvg, VideoLink, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import { Typography } from "@mui/material";
import Link from "next/link";

const MediaRenderer = (props) => {

    const iconStyle = { height: '15px', width: '15px', marginRight: '8px' }
    const serviceList = [
        { label: `Video`, icon: <VideoLink style={iconStyle} />, value: 'Video' },
        { label: `Audio`, icon: <AudioSvg style={iconStyle} />, value: 'Audio' },
        { label: `Audio Download`, icon: <AudioDownloadSvg style={iconStyle} />, value: 'Audio Download' },
        { label: `Document`, icon: <DocumentDownloadSvg style={iconStyle} />, value: 'Document' },
    ];


    const data = serviceList?.find(i => i?.value?.trim() === props?.value?.trim());

    return (
        <Typography sx={{
            color: 'black', fontSize: '12px', display: 'flex', alignItems: 'center'
        }}>
            {data?.icon}  {data?.label || '--------'}
        </Typography>
    );
}

export default MediaRenderer