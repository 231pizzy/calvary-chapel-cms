'use client'

import CMSLayout from "@/Components/CMSLayout";
import HeroIndexView from "@/Components/HeroComponents/IndexView";

import { useSearchParams } from "next/navigation";

export default function Resources() {
    const page = (useSearchParams()).get('page');

    const mapping = {
        'verse-by-verse': 'Verse By Verse',
        'wednesday-service': 'Wednesday Service',
        'sunday-service': 'Sunday Service',
        'guest-speakers': 'Guest Speaker',
        'topical-studies': 'Topical Studies',
        'conferences': 'Conferences',
    }

    return (
        <CMSLayout subMenuId='resources' menuId={'page'} pageTitle={`Pages/Resources/${mapping[page]}`}>
            <HeroIndexView page={'resource'} editUrl={`/admin/resources/hero/edit?page=${page}`} pageId={page} />
        </CMSLayout>
    );
} 