import CMSLayout from "@/Components/CMSLayout";
import SingleView from "@/Components/ResourcesComponents/AllResources/IndexView/SingleView";

export default function ViewSchedule({ }) {
    return <CMSLayout menuId='resources' pageTitle={"Resources/View Resource"}>
        <SingleView editUrl={'/admin/resources/all-resources/edit'} pageName={'resources'} returnUrl={'/admin/resources/all-resources'} />
    </CMSLayout>
}