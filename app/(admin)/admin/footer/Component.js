'use client'

import IndexView from "@/Components/HeaderFooterComponent/FooterIndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";

export default function Index() {
    return (
        <SettingLayout pageTitle={"Site Information/Footer"} subsection={'footer'} section='siteInformation'>
            <IndexView editUrl={'/admin/footer/edit'} />
        </SettingLayout>
        /*  <CMSLayout menuId='headerFooter' pageTitle={"Header & Footer"}>
            
         </CMSLayout> */
    );
} 