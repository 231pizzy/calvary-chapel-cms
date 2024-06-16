'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/ResourcesComponents/BibleCharacterComponent/IndexView";
import SettingLayout from "@/Components/SettingsComponent/SettingLayout";
import { CirclePlusSvg } from "@/public/icons/icons";
import {
    Box, Button,
} from "@mui/material";
import { useState } from "react";

export default function BibleCharacters() {
    const [count, setCount] = useState(null);
    const [openCreateForm, setOpenCreateForm] = useState(false)

    const handleCloseForm = () => {
        setOpenCreateForm(false)
    }

    const handleOpenCreateForm = () => {
        setOpenCreateForm(true)
    }



    const AddSectionButton = () => {
        return <Button onClick={() => { setOpenCreateForm(true) }} variant='outlined'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1, py: .5, fontSize: 12 }}>
            <CirclePlusSvg style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Section
        </Button>
    }

    return (
        <SettingLayout pageTitle={`Resources/Bible Characters(${count ?? 0})`} subsection={'bibleCharacters'} section='resources'       >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ maxWidth: 'max-content', ml: 'auto', mr: 2, mt: 2 }}>
                    <AddSectionButton />
                </Box>

                <IndexView setCount={setCount} handleOpenCreateForm={handleOpenCreateForm}
                    handleCloseCreateForm={handleCloseForm} showAddNewForm={openCreateForm}
                />
            </Box>

        </SettingLayout>
    );
} 