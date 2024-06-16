import CMSLayout from "@/Components/CMSLayout";
import SingleView from "../../../../../Components/LiveLinkComponents/SingleView";
//import SingleView from "@/Components/ContactComponents/PrayerRequestTopic/SingleView";

export default function ViewSchedule({ }) {
    return <CMSLayout menuId='settings' pageTitle={"Settings/Site Information/Live Link/View"}>
        <SingleView editUrl={'/admin/live-link/add-link'}
            pageName={'liveLink'} returnUrl={'/admin/live-link'}
        />
    </CMSLayout>
}