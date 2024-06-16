import { metadataObject } from "@/utils/metadata";
import EditWomenMinistry from "./Component";

export const metadata = {
    title: metadataObject?.womenMinistry?.editTitle,
    description: metadataObject?.womenMinistry?.editDescription,
}

export default function Page() {
    return <EditWomenMinistry />
}