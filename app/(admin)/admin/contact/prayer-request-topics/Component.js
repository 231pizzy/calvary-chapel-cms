'use client'

import Index from "@/Components/ContactComponents/PrayerRequestTopic/IndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";
import { FaithSvgDyn } from "@/public/icons/icons";
import {
    Box, Button,
} from "@mui/material";

export default function ContactForm() {
    const AddNewButton = () => {
        return <Button href='/admin/contact/prayer-request-topics/add-topic' variant='contained'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1.5, py: .5, fontSize: 12 }}>
            <FaithSvgDyn style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Contact Form Option
        </Button>
    }

    return (
        <SettingLayout pageTitle={`Contact/Contact Form Options`} subsection={'contactForm'} section='contact'
         /*    headComponentArray={[<AddNewButton />]} */>
            <Index />
        </SettingLayout>
    );
} 