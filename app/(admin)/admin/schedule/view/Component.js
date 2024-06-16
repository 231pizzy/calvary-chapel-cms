import CMSLayout from "@/Components/CMSLayout";
import AddNewScheduleView from "../../../../../Components/ScheduleComponents/EditView/AddView";
import SingleView from "@/Components/ScheduleComponents/IndexView/SingleView";

export default function ViewSchedule({ }) {
    return <CMSLayout menuId='schedule' pageTitle={"Schedule/View Schedule"}>
        <SingleView editUrl={'/admin/schedule/edit'} pageName={'schedule'} returnUrl={'/admin/schedule'} />
    </CMSLayout>
}