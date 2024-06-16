'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/HomePageComponent/IndexView/IndexView";

export default function HomePage() {

    return (
        <CMSLayout menuId={'page'} subMenuId='homepage' pageTitle={"Pages/Home Page"}>
            <IndexView editUrl={'/admin/homepage/edit'} />
        </CMSLayout>
    );
} 