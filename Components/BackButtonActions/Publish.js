
import { Box, Button, Typography } from "@mui/material";
import WarningModal from "../WarningModal/WarningModal";
import { useState } from "react";
import { postRequestHandler2 } from "../requestHandler";
import { useRouter } from "next/navigation";

export default function Publish({ publishEndpoint, id, returnUrl, title }) {
    const [showWarning, setShowWarning] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter()

    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null)
    }

    const handlePublish = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${publishEndpoint}`, body: { id: JSON.stringify([id]) },
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
            Publish
        </Button>

        {showWarning && <WarningModal
            title={`Publish ${title}`} open={showWarning}
            message={`You are about to publish the selected ${title}, which means they will be visible for everyone to see on the website.`}
            status={status}
            proceedAction={async () => { await handlePublish() }} handleCancel={handleCloseWarning} />}
    </Box>
}