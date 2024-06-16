import EditAdminView from "@/Components/AdminComponents/EditView/EditView";
import CMSLayout from "@/Components/CMSLayout";

export default function EditAdmin() {
    return <CMSLayout menuId='admin' pageTitle={"Admin/Edit"}>
        <EditAdminView submitEndpoint={'/api/update-admin'} returnUrl={'/admin/admin'} />
    </CMSLayout>
}