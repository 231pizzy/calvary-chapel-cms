'use client'

import CMSLayout from "@/Components/CMSLayout";
import HeroEditView from "../../../../../../Components/HeroComponents/EditView";
import { useSearchParams } from "next/navigation";

export default function EditHistory({ }) {
    const page = (useSearchParams()).get('page');

    const mapping = {
        'verse-by-verse': 'Verse By Verse',
        'wednesday-service': 'Wednesday Service',
        'sunday-service': 'Sunday Service',
        'guest-speakers': 'Guest Speaker',
        'topical-studies': 'Topical Studies',
        'conferences': 'Conferences',
    }

    const pageName = mapping[page];

    return <CMSLayout subMenuId='resources' menuId={'page'} pageTitle={`Pages/Resources/${pageName}/Edit`}>
        <HeroEditView submitEndpoint={`/api/update-hero`} title={pageName} pageName={page}
            returnUrl={`/admin/resources/hero?page=${page}`} />
    </CMSLayout>
}