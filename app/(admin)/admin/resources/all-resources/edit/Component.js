import CMSLayout from "@/Components/CMSLayout";
import AddNewResourceView from "@/Components/ResourcesComponents/AllResources/EditView/AddView";

export default function AddSchedule({ }) {
    return <CMSLayout menuId='resources' pageTitle={"Resources/Edit Resource"}>
        <AddNewResourceView submitEndpoint={'/api/add-resource'} pageName={'resource'} returnUrl={'/admin/resources/all-resources'} />
    </CMSLayout>
}