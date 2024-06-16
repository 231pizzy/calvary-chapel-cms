'use client'

import CMSLayout from "@/Components/CMSLayout";
import AddView from "@/Components/LocationComponent/EditView";
import { useSearchParams } from "next/navigation";

export default function AddTopic({ }) {
    const params = useSearchParams();

    return <CMSLayout menuId='settings' pageTitle={`Settings/Site Information/Location/${params.get('id') ? 'Edit' : 'Add New'} Location`}>
        <AddView submitEndpoint={'/api/add-location'} pageName={'location'} returnUrl={'/admin/location'} />
    </CMSLayout>
}