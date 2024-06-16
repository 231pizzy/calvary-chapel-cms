'use client'

import CMSLayout from "@/Components/CMSLayout";
import ReplyView from "@/Components/ContactComponents/Enquiries/ReplyView";
import {
    Box,
} from "@mui/material";

export default function ContactForm() {

    return (
        <CMSLayout menuId='contact' subMenuId={'enquiries'} pageTitle={"Contact/Enquiries/Reply"}>
            <ReplyView submitEndpoint={'/api/send-reply'} pageName={'contact'} returnUrl={'/admin/contact'} />
        </CMSLayout>
    );
} 