'use client'

import IndexView from "@/Components/AboutComponents/HIstoryComponents/IndexView/IndexView";
import CMSLayout from "@/Components/CMSLayout";
import {
    Box,
} from "@mui/material";

export default function History() {

    return (
        <CMSLayout menuId='page' subMenuId={'about'} pageTitle={"Pages/About CCT/History of CCT"}>
            <IndexView editUrl={'/admin/about/history/edit'} />
        </CMSLayout>
    );
} 