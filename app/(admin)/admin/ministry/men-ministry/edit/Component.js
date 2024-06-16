import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/MinistryComponents/EditView/EditView";
import { Box } from "@mui/material";

export default function EditMenMinistry({ }) {
    return <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Ministry/Men's Ministry/Edit"}>
        <EditView ministry={'men-service'} submitEndpoint={'/api/update-ministry'}
            returnUrl={'/admin/ministry/men-ministry'} />
    </CMSLayout>
}