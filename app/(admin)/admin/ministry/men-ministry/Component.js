'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/MinistryComponents/IndexView/IndexView";
import {
    Box,
} from "@mui/material";

export default function MenMinistry() {

    return (
        <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Men's Ministry"}>
            <IndexView ministry="men-service" editUrl={'/admin/ministry/men-ministry/edit'} />
        </CMSLayout>
    );
} 