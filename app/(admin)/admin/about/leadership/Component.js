'use client'

import IndexView from "@/Components/AboutComponents/LeadershipComponents/IndexView/IndexView";
import CMSLayout from "@/Components/CMSLayout";

export default function Leadership() {
    return (
        <CMSLayout menuId='page' subMenuId={'about'} pageTitle={"Pages/About CCT/Leadership"}>
            <IndexView editUrl={'/admin/about/leadership/edit'} />
        </CMSLayout>
    );
} 