'use client'

import IndexView from "@/Components/HeaderFooterComponent/HeaderIndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";

export default function Index() {
    return (
        <SettingLayout pageTitle={"Site Information/Header"} subsection={'header'} section='siteInformation'>
            <IndexView editUrl={'/admin/header/edit'} />
        </SettingLayout>
        /*  <CMSLayout menuId='headerFooter' pageTitle={"Header & Footer"}>
            
         </CMSLayout> */
    );
} 