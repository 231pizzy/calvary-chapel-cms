
import { Box, Button, Typography } from "@mui/material";
import WarningModal from "../WarningModal/WarningModal";
import { useState } from "react";
import { postRequestHandler2 } from "../requestHandler";
import { useRouter } from "next/navigation";

export default function Unpublish({ unpublishEndpoint, id, returnUrl, title }) {
    const [showWarning, setShowWarning] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter()


    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null)
    }

    const handleUnpublish = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${unpublishEndpoint}`, body: { id: JSON.stringify([id]) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('unpublished ');
                    router.replace(returnUrl)
                }
                else {
                    console.log('error unpublishing ');
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
            Unpublish
        </Button>

        {showWarning && <WarningModal
            title={`Unpublish ${title}`} open={showWarning}
            message={`You are about to unpublish all the ${title}, which means it will no longer be visible on the website`}
            status={status}
            proceedAction={async () => { await handleUnpublish() }} handleCancel={handleCloseWarning} />}
    </Box>
}