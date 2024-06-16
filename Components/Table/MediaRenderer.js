
import { AudioDownloadSvg, AudioSvg, BlueEditSvg, DocumentDownloadSvg, DownloadSvg, EditSvg, NoteSvgDyn, PdfSvg, VideoLink, VideoSvg } from '@/public/icons/icons';
import { useRouter } from 'next/navigation';
import saveAs from 'file-saver';
import { Box, IconButton } from '@mui/material';
import { useState } from 'react';
import MapResources from '../ScheduleComponents/MapResources';

const MediaRenderer = (props) => {
    const router = useRouter();

    const [showMapping, setShowMapping] = useState(false);

    const handleFileDownload = ({ fileUrl, name }) => {
        saveAs(fileUrl, name)
    }

    const handleOpenMapping = () => {
        setShowMapping(true)
    }

    const handleCloseMapping = () => {
        setShowMapping(false)
    }

    const iconStyle = { width: '20px', height: '20px' }
    const iconStyle2 = { width: '25px', height: '25px', }
    const actionData = {
        audio: {
            icon: <AudioSvg style={iconStyle} />, title: 'Watch audio',
            action: (url) => { router.push(url) }
        },
        video: {
            icon: <VideoLink title='Watch video' style={iconStyle} />, title: 'Watch video',
            action: (url) => { router.push(url) }
        },
        audioDownload: {
            icon: <AudioDownloadSvg title='Download Audio' style={iconStyle} />, title: 'Download Audio',
            action: (fileUrl) => { handleFileDownload({ fileUrl, name: `audio.${fileUrl?.split('.')?.pop()}` }) }
        },
        documentDownload: {
            icon: <DocumentDownloadSvg title='Download Document' style={iconStyle} />, title: 'Download Document',
            action: (fileUrl) => { handleFileDownload({ fileUrl, name: `document.${fileUrl?.split('.')?.pop()}` }) }
        },
        resourceMapping: {
            icon: <BlueEditSvg title='Resource Mapping' style={iconStyle2} />, title: 'Resource Mapping',
            action: handleOpenMapping
        },
    }

    const items = [
        'video', 'audio', 'audioDownload', 'documentDownload', 'resourceMapping'
    ]

    return (
        !props?.data?.id ? <div></div> : <Box sx={{
            width: '100%', p: .4, verticalAlign: 'middle', maxWidth: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {items?.map((item, index) => {
                const value = props?.value[item];
                return value ? <IconButton title={actionData[item]?.title}
                    onClick={() => { actionData[item]?.action(value) }} key={index} sx={{
                        mr: .3, p: .5, minWidth: 0
                    }}>
                    {actionData[item]?.icon}
                </IconButton> : <div /* style={{ minWidth: '30px' }} */></div>
            })}

            {showMapping && <MapResources selectedDate={props?.data?.mappedDate}
                selectedResourceId={props?.data?.resourceId}
                scheduleId={props?.data?.id}
                open={showMapping} handleClose={handleCloseMapping}
            />}
        </Box>
    );
}

export default MediaRenderer