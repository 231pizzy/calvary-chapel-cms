'use client'

import IndexView from "@/Components/MetaComponents/IndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";

export default function Index() {
    return (
        <SettingLayout pageTitle={"Site Information/Meta Information"} subsection={'meta'} section='siteInformation'>
            <IndexView editUrl={'/admin/meta/edit'} />
        </SettingLayout>
    );
} 