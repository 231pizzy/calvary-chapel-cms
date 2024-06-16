import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/MinistryComponents/EditView/EditView";
import { Box } from "@mui/material";

export default function EditWomenMinistry({ }) {
    return <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Women's Ministry/Edit"}>
        <EditView ministry={'women-service'} submitEndpoint={'/api/update-ministry'}
            returnUrl={'/admin/ministry/women-ministry'} />
    </CMSLayout>
}