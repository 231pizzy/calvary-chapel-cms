'use client'

import CMSLayout from "@/Components/CMSLayout";
import IndexView from "@/Components/ContactComponents/ContactForm/IndexView/IndexView";
import {
    Box,
} from "@mui/material";

export default function ContactForm() {

    return (
        <CMSLayout menuId='page' subMenuId={'contact'} pageTitle={"Pages/Contact"}>
            <IndexView editUrl={'/admin/contact/contact-form/edit'} />
        </CMSLayout>
    );
} 