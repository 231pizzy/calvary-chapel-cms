import { metadataObject } from "@/utils/metadata";
import Contact from "./Component";

export const metadata = {
    title: metadataObject?.contact?.viewTitle,
    description: metadataObject?.contact?.viewDescription,
}

export default function Page() {
    return <Contact />
}