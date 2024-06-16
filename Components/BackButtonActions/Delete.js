
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import WarningModal from "../WarningModal/WarningModal";
import { useState } from "react";
import { postRequestHandler2 } from "../requestHandler";
import { useRouter } from "next/navigation";
import { DeleteSvg } from "@/public/icons/icons";

export default function Delete({ deleteEndpoint, id, returnUrl, title }) {
    const [showWarning, setShowWarning] = useState(false);
    const [status, setStatus] = useState(null);

    const router = useRouter()


    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null)
    }

    const handleDeleteAll = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${deleteEndpoint}`, body: { id: JSON.stringify([id]) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    router.replace(returnUrl)
                }
                else {
                    console.log('error deleting ');
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
        <DeleteSvg onClick={openWarning} style={{ width: '30px', height: '30px', cursor: 'pointer', margin: '0 12px' }} />

        {showWarning && <WarningModal
            title={`Delete ${title}`} open={showWarning}
            message={`You are about to delete this ${title}`}
            status={status}
            proceedAction={async () => { await handleDeleteAll() }} handleCancel={handleCloseWarning} />}
    </Box>
}