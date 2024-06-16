'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/MinistryComponents/IndexView/IndexView";
import {
    Box,
} from "@mui/material";

export default function ChildrenMinistry() {

    return (
        <CMSLayout menuId='page' subMenuId={'ministry'} pageTitle={"Pages/Ministry/Children's Ministry"}>
            <IndexView ministry="children-service" editUrl={'/admin/ministry/children-ministry/edit'} />
        </CMSLayout>
    );
} 