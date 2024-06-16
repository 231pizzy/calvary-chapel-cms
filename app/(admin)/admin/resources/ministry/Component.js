'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/ResourcesComponents/MinistryComponent/IndexView";
import { CirclePlusSvg } from "@/public/icons/icons";
import {
    Box, Button,
} from "@mui/material";
import { useState } from "react";

export default function ResourceMinistry() {
    const [count, setCount] = useState(null);
    const [openCreateForm, setOpenCreateForm] = useState(false)

    const handleCloseForm = () => {
        setOpenCreateForm(false)
    }

    const handleOpenForm = () => {
        setOpenCreateForm(true)
    }


    const AddSectionButton = () => {
        return <Button onClick={() => { setOpenCreateForm(true) }} variant='outlined'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1, py: .5, fontSize: 12 }}>
            <CirclePlusSvg style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Ministry
        </Button>
    }

    return (
        <CMSLayout menuId='resources' subMenuId={'resource-ministry'} pageTitle={`Resources/Ministry(${count ?? 0})`}
            headComponentArray={[<AddSectionButton />]}>
            <IndexView setCount={setCount} handleOpenCreateForm={handleOpenForm}
                handleCloseCreateForm={handleCloseForm} showAddNewForm={openCreateForm}
            />
        </CMSLayout>
    );
} 