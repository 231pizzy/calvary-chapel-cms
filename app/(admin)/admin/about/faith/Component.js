'use client'

import IndexView from "@/Components/AboutComponents/FaithComponents/IndexView/IndexView";
import CMSLayout from "@/Components/CMSLayout";

export default function History() {

    return (
        <CMSLayout menuId='page' subMenuId={'about'} pageTitle={"Pages/About CCT/Statement Of Faith"}>
            <IndexView editUrl={'/admin/about/faith/edit'} />
        </CMSLayout>
    );
} 