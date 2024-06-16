import CMSLayout from "@/Components/CMSLayout";
import SingleView from "@/Components/ContactComponents/ContactEnquiryEmails/SingleView";
//import SingleView from "@/Components/ContactComponents/PrayerRequestTopic/SingleView";

export default function ViewSchedule({ }) {
    return <CMSLayout menuId='settings' pageTitle={"Settings/Contact/Contact Enquiry Emails/View"}>
        <SingleView editUrl={'/admin/contact/contact-email/add-email'}
            pageName={'contactEmail'} returnUrl={'/admin/contact/contact-email'}
        />
    </CMSLayout>
}