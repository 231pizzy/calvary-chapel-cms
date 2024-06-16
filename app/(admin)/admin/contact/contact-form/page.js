import { metadataObject } from "@/utils/metadata";
import Contact from "./Component";

export const metadata = {
    title: metadataObject?.contactForm?.title,
    description: metadataObject?.contactForm?.description,
}

export default function Page() {
    return <Contact />
}