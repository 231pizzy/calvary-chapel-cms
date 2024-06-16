'use client'

import CMSLayout from "@/Components/CMSLayout";
import AddView from "@/Components/ContactComponents/PrayerRequestTopic/EditView";
import { useSearchParams } from "next/navigation";

export default function AddTopic({ }) {
    const params = useSearchParams();

    return <CMSLayout menuId='settings' pageTitle={`Settings/Contact/Contact Form Options/${params.get('id') ? 'Edit' : 'Add New'} Contact Form Option`}>
        <AddView submitEndpoint={'/api/add-prayer-request-topic'} pageName={'prayerRequestTopic'} returnUrl={'/admin/contact/prayer-request-topics'} />
    </CMSLayout>
}