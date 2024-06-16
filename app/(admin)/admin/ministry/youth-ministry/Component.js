'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/MinistryComponents/IndexView/IndexView";
import {
    Box,
} from "@mui/material";

export default function YouthMinistry() {

    return (
        <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Youth's Ministry"}>
            <IndexView ministry="youth-service" editUrl={'/admin/ministry/youth-ministry/edit'} />
        </CMSLayout>
    );
} 