import { metadataObject } from "@/utils/metadata";
import EditHistory from "./Component";

export const metadata = {
    title: metadataObject?.contactForm?.editTitle,
    description: metadataObject?.contactForm?.editDescription,
}

export default function Page() {
    return <EditHistory />
}