'use client'

import SettingLayout from "@/Components/SettingsComponent/SettingLayout";
import {
    Box, Button,
} from "@mui/material";
import Index from "../../../../Components/LiveLinkComponents/IndexView";

export default function ContactForm() {
    const AddNewButton = () => {
        return <Button href='/admin/live-link/add-link' variant='contained'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1.5, py: .5, fontSize: 12 }}>
            Add New Live Link
        </Button>
    }

    return (
        <SettingLayout pageTitle={`Site Information/Live Link`} subsection={'liveLink'} section='siteInformation' >
            <Index />
        </SettingLayout>
    );
} 