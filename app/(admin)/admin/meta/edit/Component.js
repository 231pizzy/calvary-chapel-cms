'use client'

import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/MetaComponents/EditView";
import IndexView from "@/Components/MetaComponents/IndexView";

export default function Index() {
    return (
        <CMSLayout menuId='settings' pageTitle={"Settings/Site Information/Meta Information/Edit"}>
            <EditView submitEndpoint={'/api/update-meta'} returnUrl={'/admin/meta'} />
        </CMSLayout>
    );
} 