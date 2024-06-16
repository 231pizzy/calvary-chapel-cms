
import CMSLayout from "@/Components/CMSLayout";
import EditView from "@/Components/ContactComponents/ContactForm/EditView/EditView";

export default function EditHistory({ }) {
    return <CMSLayout menuId='page' subMenuId={'contact'} pageTitle={"Pages/Contact/Edit"}>
        <EditView submitEndpoint={'/api/update-contact-form'} pageName={'contactForm'} returnUrl={'/admin/contact/contact-form'} />
    </CMSLayout>
}