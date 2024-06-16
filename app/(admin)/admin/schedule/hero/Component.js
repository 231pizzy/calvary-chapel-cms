'use client'

import CMSLayout from "@/Components/CMSLayout";
import HeroIndexView from "@/Components/HeroComponents/IndexView";
import {
    Box,
} from "@mui/material";

export default function Schedules() {

    return (
        <CMSLayout subMenuId='schedule' menuId={'page'} pageTitle={`Pages/Schedules`}>
            <HeroIndexView pageId={'schedule'} editUrl={'/admin/schedule/hero/edit?page=schedule'} />
        </CMSLayout>
    );
} 