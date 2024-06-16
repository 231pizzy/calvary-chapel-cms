'use client'

import CMSLayout from "@/Components/CMSLayout";
//import AddView from "@/Components/ContactComponents/PrayerRequestTopic/EditView";
import { useSearchParams } from "next/navigation";
import AddView from "../../../../../Components/LiveLinkComponents/EditView";

export default function AddTopic({ }) {
    const params = useSearchParams();

    return <CMSLayout menuId='settings' pageTitle={`Site Information/${params.get('id') ? 'Edit' : 'Add New'} Live Link`}>
        <AddView submitEndpoint={'/api/add-live-link'} pageName={'liveLink'} returnUrl={'/admin/live-link'} />
    </CMSLayout>
}