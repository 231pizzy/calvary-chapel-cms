'use client'

import CMSLayout from "@/Components/CMSLayout";
import HeroEditView from "../../../../../../Components/HeroComponents/EditView";
import { useSearchParams } from "next/navigation";

export default function EditHistory({ }) {
    return <CMSLayout subMenuId='schedule' menuId={'page'} pageTitle={`Pages/Schedules/Edit`}>
        <HeroEditView submitEndpoint={`/api/update-hero`} title={'Schedule'} pageName={'schedule'}
            returnUrl={`/admin/schedule/hero`} />
    </CMSLayout>
}