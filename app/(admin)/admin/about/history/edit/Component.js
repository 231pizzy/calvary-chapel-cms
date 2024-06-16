import EditView from "@/Components/AboutComponents/HIstoryComponents/EditView/EditView";
import CMSLayout from "@/Components/CMSLayout";

export default function EditHistory({ }) {
    return <CMSLayout menuId='page' subMenuId={'about'} pageTitle={"Pages/About CCT/History of CCT/Edit"}>
        <EditView submitEndpoint={'/api/update-history'} pageName={'history'} returnUrl={'/admin/about/history'} />
    </CMSLayout>
}