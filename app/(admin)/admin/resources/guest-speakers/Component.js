'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/ResourcesComponents/GuestSpeakerComponents/IndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";
import { CirclePlusSvg } from "@/public/icons/icons";
import {
    Box, Button,
} from "@mui/material";
import { useState } from "react";

export default function GuestSpeakers() {
    const [count, setCount] = useState(null);
    const [openCreateForm, setOpenCreateForm] = useState(false)

    const handleCloseForm = () => {
        setOpenCreateForm(false)
    }


    const AddSpeakerButton = () => {
        return <Button onClick={() => { setOpenCreateForm(true) }} variant='outlined'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1, py: .5, fontSize: 12 }}>
            <CirclePlusSvg style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Guest Speaker
        </Button>
    }

    return (
        <SettingLayout pageTitle={`Resources/Guest Speakers(${count ?? 0})`} subsection={'guestSpeakers'} section='resources'>
            <IndexView setCount={setCount} handleCloseCreateForm={handleCloseForm} showAddNewForm={openCreateForm} />
        </SettingLayout>
    );
} 