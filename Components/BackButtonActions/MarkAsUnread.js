
import { Box, Button, Typography } from "@mui/material";
import WarningModal from "../WarningModal/WarningModal";
import { useState } from "react";
import { postRequestHandler2 } from "../requestHandler";
import { useRouter } from "next/navigation";

export default function MarkAsUnread({ markAsUnreadEndpoint, id, returnUrl, title }) {
    const [showWarning, setShowWarning] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter()

    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null)
    }

    const handleMarkAsUnread = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${markAsUnreadEndpoint}`, body: { id: JSON.stringify([id]) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('unread ');
                    router.replace(returnUrl)
                }
                else {
                    console.log('error unreading ');
                    handleCloseWarning()
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                handleCloseWarning();
            }
        })
    }

    const openWarning = () => {
        setShowWarning(true)
    }


    return <Box>
        <Button variant="outlined" onClick={openWarning} sx={{ fontSize: 13, cursor: 'pointer', mx: 1, py: .3 }} >
            Mark as unread
        </Button>

        {showWarning && <WarningModal
            title={`Mark ${title} as unread`} open={showWarning}
            message={`You are about to mark this enquiry as unread`}
            status={status}
            proceedAction={async () => { await handleMarkAsUnread() }} handleCancel={handleCloseWarning} />}
    </Box>
}