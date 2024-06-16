'use client'

import CMSLayout from "@/Components/CMSLayout";
import EnquiriesIndex from "@/Components/ContactComponents/Enquiries/IndexView";
import { FilterButton } from "@/Components/FilterButton";
import {
    Box,
} from "@mui/material";
import { useState } from "react";

export default function Contact() {
    const [showFilter, setShowFilter] = useState(false);

    const handleOpenFilter = () => {
        setShowFilter(true)
    }

    const handleCloseFilter = () => {
        setShowFilter(false)
    }


    return (
        <CMSLayout menuId='contact' subMenuId={'enquiries'} pageTitle={"Contact/Enquiries"}
            headComponentArray={[<FilterButton handleOpenFilter={handleOpenFilter} />]}>
            <EnquiriesIndex closeFilter={handleCloseFilter} showFilter={showFilter} />
        </CMSLayout>
    );
} 