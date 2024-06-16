'use client'

import CMSLayout from "@/Components/CMSLayout";
import AddView from "@/Components/ContactComponents/ContactEnquiryEmails/EditView";
//import AddView from "@/Components/ContactComponents/PrayerRequestTopic/EditView";
import { useSearchParams } from "next/navigation";

export default function AddTopic({ }) {
    const params = useSearchParams();

    return <CMSLayout menuId='settings' pageTitle={`Settings/Contact/Contact Enquiry Emails/${params.get('id') ? 'Edit' : 'Add New'} Contact Form Option`}>
        <AddView submitEndpoint={'/api/add-contact-email'} pageName={'contactEmail'} returnUrl={'/admin/contact/contact-email'} />
    </CMSLayout>
}