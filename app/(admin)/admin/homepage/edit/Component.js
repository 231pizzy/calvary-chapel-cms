import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/HomePageComponent/EditView/EditView";

export default function EditHomepage({ }) {
    return <CMSLayout menuId='page' subMenuId='homepage' pageTitle={"Pages/Home Page/Edit"}>
        <EditView submitEndpoint={'/api/update-homepage'} pageName={'homepage'} returnUrl={'/admin/homepage'} />
    </CMSLayout>
}