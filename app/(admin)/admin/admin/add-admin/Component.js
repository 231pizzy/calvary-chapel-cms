import AddNewAdminView from "@/Components/AdminComponents/EditView/AddNewAdminView";
import CMSLayout from "@/Components/CMSLayout";
import { Box } from "@mui/material";

export default function AddAdmin() {
    return <CMSLayout menuId='admin' pageTitle={"Admin/Create"}>
        <AddNewAdminView submitEndpoint={'/api/update-admin'} returnUrl={'/admin/admin'} />
    </CMSLayout>
}