import { metadataObject } from "@/utils/metadata";
import Contact from "./Component";

export const metadata = {
    title: metadataObject?.contact?.replyTitle,
    description: metadataObject?.contact?.replyDescription,
}

export default function Page() {
    return <Contact />
}