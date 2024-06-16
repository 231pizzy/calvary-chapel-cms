
import { Box, Button, Typography } from "@mui/material";
import WarningModal from "../WarningModal/WarningModal";
import { useState } from "react";
import { postRequestHandler2 } from "../requestHandler";
import { useRouter } from "next/navigation";

export default function MarkAsRead({ markAsReadEndpoint, id, returnUrl, title }) {
    const [showWarning, setShowWarning] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter()

    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null)
    }

    const handleMarkAsRead = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${markAsReadEndpoint}`, body: { id: JSON.stringify([id]) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('read ');
                    router.replace(returnUrl)
                }
                else {
                    console.log('error reading ');
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
            Mark as read
        </Button>

        {showWarning && <WarningModal
            title={`Mark ${title} as read`} open={showWarning}
            message={`You are about to mark this enquiry as read`}
            status={status}
            proceedAction={async () => { await handleMarkAsRead() }} handleCancel={handleCloseWarning} />}
    </Box>
}