import CMSLayout from "@/Components/CMSLayout";
import SingleView from "@/Components/LocationComponent/SingleView";

export default function ViewSchedule({ }) {
    return <CMSLayout menuId='settings' pageTitle={"Settings/Site Information//Location/View"}>
        <SingleView editUrl={'/admin/location/add-location'}
            pageName={'location'} returnUrl={'/admin/location'}
        />
    </CMSLayout>
}