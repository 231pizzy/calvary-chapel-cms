'use client'

import SettingLayout from "@/Components/SettingsComponent/SettingLayout";
import IndexView from "@/Components/LocationComponent/IndexView";

export default function Index() {
    return (
        <SettingLayout pageTitle={"Site Information/Location"} subsection={'location'} section='siteInformation'>
            {/* <IndexView editUrl={'/admin/header/edit'} /> */}
            <IndexView />
        </SettingLayout>
    );
} 