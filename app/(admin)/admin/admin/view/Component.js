
import CMSLayout from "@/Components/CMSLayout";
import SingleView from "../../../../../Components/AdminComponents/IndexView/SingleView";

export default function ViewAdmin() {
    return <CMSLayout menuId='admin' pageTitle={"Admin/View"}>
        <SingleView editUrl={'/admin/admin/edit'} />
    </CMSLayout>
}