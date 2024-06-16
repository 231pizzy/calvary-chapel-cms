'use client'
import CMSLayout from "@/Components/CMSLayout";
import EditViewFooter from "@/Components/HeaderFooterComponent/EditViewFooter";
import EditViewHeader from "@/Components/HeaderFooterComponent/EditViewHeader";
import { useSearchParams } from "next/navigation";

export default function EditHistory({ }) {
    const params = useSearchParams();

    return <CMSLayout menuId='settings' pageTitle={"Settings/Site Information/Footer/Edit"}>
        {params.get('type') === 'header'
            ? <EditViewHeader submitEndpoint={'/api/update-header'} pageName={'header'} returnUrl={'/admin/footer'} />
            : <EditViewFooter submitEndpoint={'/api/update-footer'} pageName={'footer'} returnUrl={'/admin/header'} />}
    </CMSLayout>
}