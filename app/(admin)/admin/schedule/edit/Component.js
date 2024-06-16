import CMSLayout from "@/Components/CMSLayout";
import AddNewScheduleView from "../../../../../Components/ScheduleComponents/EditView/AddView";

export default function AddSchedule({ }) {
    return <CMSLayout menuId='schedule' pageTitle={"Schedule/Edit Schedule"}>
        <AddNewScheduleView submitEndpoint={'/api/add-schedule'} pageName={'schedule'} returnUrl={'/admin/schedule'} />
    </CMSLayout>
}