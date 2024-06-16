'use client'

import CMSLayout from "@/Components/CMSLayout";
import { FilterButton } from "@/Components/FilterButton";
import ResourceIndex from "@/Components/ResourcesComponents/AllResources/IndexView/IndexView";
import { CalendarSvg, CirclePlusSvg } from "@/public/icons/icons";
import {
    Box, Button,
} from "@mui/material";
import { useState } from "react";

export default function AllResources() {
    const [showFilter, setShowFilter] = useState(false);

    const handleOpenFilter = () => {
        setShowFilter(true)
    }

    const handleCloseFilter = () => {
        setShowFilter(false)
    }


    const AddNewButton = () => {
        return <Button href='/admin/resources/all-resources/add-resource' variant='contained'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1.5, py: .5, fontSize: 12 }}>
            <CirclePlusSvg style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Resource
        </Button>
    }

    return (
        <CMSLayout menuId='resources' pageTitle={"Resources"}
            headComponentArray={[<FilterButton handleOpenFilter={handleOpenFilter} />, <AddNewButton />]}
        >
            <ResourceIndex closeFilter={handleCloseFilter} showFilter={showFilter} />
        </CMSLayout>
    );
} 