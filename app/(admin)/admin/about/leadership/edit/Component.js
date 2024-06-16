import EditView from "@/Components/AboutComponents/LeadershipComponents/EditView/EditView";
import CMSLayout from "@/Components/CMSLayout";

export default function EditHistory({ }) {
    return <CMSLayout menuId='page' subMenuId={'about'} pageTitle={"Pages/About CCT/Leadership/Edit"}>
        <EditView submitEndpoint={'/api/update-leadership'} pageName={'leadership'} returnUrl={'/admin/about/leadership'} />
    </CMSLayout>
}