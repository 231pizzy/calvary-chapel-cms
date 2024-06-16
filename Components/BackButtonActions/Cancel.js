
import { Box, Button, Typography } from "@mui/material";
import WarningModal from "../WarningModal/WarningModal";
import { useState } from "react";
import { postRequestHandler2 } from "../requestHandler";
import { useRouter } from "next/navigation";

export default function Cancel({ cancelEndpoint, id, returnUrl, title }) {
    const [showWarning, setShowWarning] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter()


    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null)
    }

    const handleCancel = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${cancelEndpoint}`, body: { id: JSON.stringify([id]) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('published ');
                    router.replace(returnUrl)
                }
                else {
                    console.log('error publishing ');
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
            Cancel
        </Button>

        {showWarning && <WarningModal
            title={`Cancel ${title}`} open={showWarning}
            message={`You are about to cancel the selected ${title}, which means all events will no longer hold`}
            status={status}
            proceedAction={async () => { await handleCancel() }} handleCancel={handleCloseWarning} />}
    </Box>
}