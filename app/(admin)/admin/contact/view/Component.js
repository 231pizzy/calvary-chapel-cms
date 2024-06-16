'use client'

import CMSLayout from "@/Components/CMSLayout";
import SingleView from "@/Components/ContactComponents/Enquiries/SingleView";
import {
    Box,
} from "@mui/material";

export default function ContactForm() {

    return (
        <CMSLayout menuId='contact' subMenuId={'enquiries'} pageTitle={"Contact/Enquiries/View"}>
            <SingleView replyUrl={'/admin/contact/reply'} pageName={'contact'} returnUrl={'/admin/contact'} />
        </CMSLayout>
    );
} 