import { metadataObject } from "@/utils/metadata";
import EditChildrenMinistry from "./Component";

export const metadata = {
    title: metadataObject?.childrenMinistry?.editTitle,
    description: metadataObject?.childrenMinistry?.editDescription,
}

export default function Page() {
    return <EditChildrenMinistry />
}