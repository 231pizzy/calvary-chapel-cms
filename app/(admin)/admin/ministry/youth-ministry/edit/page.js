import { metadataObject } from "@/utils/metadata";
import EditYouthMinistry from "./Component";

export const metadata = {
    title: metadataObject?.youthMinistry?.editTitle,
    description: metadataObject?.youthMinistry?.editDescription,
}

export default function Page() {
    return <EditYouthMinistry />
}