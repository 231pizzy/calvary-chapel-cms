import CMSLayout from "@/Components/CMSLayout";
import SingleView from "@/Components/ContactComponents/PrayerRequestTopic/SingleView";

export default function ViewSchedule({ }) {
    return <CMSLayout menuId='settings' pageTitle={"Settings/Contact/Contact Form Options/View"}>
        <SingleView editUrl={'/admin/contact/prayer-request-topics/add-topic'}
            pageName={'prayerRequestTopics'} returnUrl={'/admin/contact/prayer-request-topics'}
        />
    </CMSLayout>
}