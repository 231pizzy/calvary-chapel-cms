import EditView from "@/Components/AboutComponents/FaithComponents/EditView/EditView";
import CMSLayout from "@/Components/CMSLayout";

export default function EditHistory({ }) {
    return <CMSLayout menuId='page' subMenuId={'about'} pageTitle={"Pages/About CCT/Statement Of Faith/Edit"}>
        <EditView submitEndpoint={'/api/update-faith'} pageName={'faith'} returnUrl={'/admin/about/faith'} />
    </CMSLayout>
}