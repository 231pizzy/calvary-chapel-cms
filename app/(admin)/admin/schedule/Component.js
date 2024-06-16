'use client'

import CMSLayout from "@/Components/CMSLayout";
import { FilterButton } from "@/Components/FilterButton";
import ScheduleIndex from "@/Components/ScheduleComponents/IndexView/IndexView";
import { CalendarSvg, CirclePlusSvg } from "@/public/icons/icons";
import {
    Box, Button,
} from "@mui/material";

import { useState } from "react";

export default function Schedule() {
    const [showFilter, setShowFilter] = useState(false);

    const handleOpenFilter = () => {
        setShowFilter(true)
    }

    const handleCloseFilter = () => {
        setShowFilter(false)
    }


    const AddAdminButton = () => {
        return <Button href='/admin/schedule/add-schedule' variant='contained'
            sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', px: 1.5, py: .5, fontSize: 12 }}>
            <CirclePlusSvg style={{ height: '15px', width: '15px', marginRight: '8px' }} />  Add New Schedule
        </Button>
    }

    return (
        <CMSLayout menuId='schedule' pageTitle={"Schedule"}
            headComponentArray={[<FilterButton handleOpenFilter={handleOpenFilter} />, <AddAdminButton />]}
        >
            <ScheduleIndex closeFilter={handleCloseFilter} showFilter={showFilter} />
        </CMSLayout>
    );
} 