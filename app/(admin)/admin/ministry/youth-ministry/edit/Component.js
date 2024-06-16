import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/MinistryComponents/EditView/EditView";
import { Box } from "@mui/material";

export default function EditYouthMinistry({ }) {
    return <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Youth's Ministry/Edit"}>
        <EditView ministry={'youth-service'} submitEndpoint={'/api/update-ministry'}
            returnUrl={'/admin/ministry/youth-ministry'} />
    </CMSLayout>
}