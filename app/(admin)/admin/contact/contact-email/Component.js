'use client'

import Index from "@/Components/ContactComponents/ContactEnquiryEmails/IndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";
import {
    Box, Button,
} from "@mui/material";

export default function ContactForm() {
    const AddNewButton = () => {
        return <Button href='/admin/contact/contact-email/add-email' variant='contained'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1.5, py: .5, fontSize: 12 }}>
            Add New Contact Enquiry Email
        </Button>
    }

    return (
        <SettingLayout pageTitle={`Contact/Contact Enquiry Email`} subsection={'contactEmail'} section='contact' >
            <Index />
        </SettingLayout>
    );
} 