'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/MinistryComponents/IndexView/IndexView";
import {
    Box,
} from "@mui/material";

export default function WomenMinistry() {

    return (
        <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Women's Ministry"}>
            <IndexView ministry="women-service" editUrl={'/admin/ministry/women-ministry/edit'} />
        </CMSLayout>
    );
} 