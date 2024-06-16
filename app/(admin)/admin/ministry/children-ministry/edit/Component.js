import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/MinistryComponents/EditView/EditView";
import { Box } from "@mui/material";

export default function EditChildrenMinistry({ }) {
    return <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Children's Ministry/Edit"}>
        <EditView ministry={'children-service'} submitEndpoint={'/api/update-ministry'}
            returnUrl={'/admin/ministry/children-ministry'} />
    </CMSLayout>
}