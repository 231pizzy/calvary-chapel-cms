import { metadataObject } from "@/utils/metadata";
import Contact from "./Component";

export const metadata = {
    title: metadataObject?.contact?.title,
    description: metadataObject?.contact?.description,
}

export default function Page() {
    return <Contact />
}