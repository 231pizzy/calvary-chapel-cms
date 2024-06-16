'use client'

import CMSLayout from "@/Components/CMSLayout";
import Dashboard from "@/Components/Dashboard/Dashboard";
import {
    Box,
} from "@mui/material";

export default function AdminDashboard() {

    return (
        <CMSLayout menuId='dashboard' pageTitle={"Dashboard"}>
            <Dashboard />
        </CMSLayout>
    );
} 