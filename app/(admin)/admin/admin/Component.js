'use client'

import AdminIndex from "@/Components/AdminComponents/IndexView/IndexView";
import CMSLayout from "@/Components/CMSLayout";
import { AdminSvg } from "@/public/icons/icons";
import { Button } from "@mui/material";

export default function Admin() {
    const AddAdminButton = () => {
        return <Button href='/admin/admin/add-admin' variant='contained'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1, py: .5, fontSize: 12 }}>
            <AdminSvg style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Admin
        </Button>
    }

    return (
        <CMSLayout menuId='admin' pageTitle={"Admin"} headComponentArray={[<AddAdminButton />]}>
            <AdminIndex />
        </CMSLayout>
    );
} 