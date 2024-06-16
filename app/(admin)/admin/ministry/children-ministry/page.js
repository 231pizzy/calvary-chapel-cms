import { metadataObject } from "@/utils/metadata";
import ChildrenMinistry from "./Component";

export const metadata = {
    title: metadataObject?.childrenMinistry?.title,
    description: metadataObject?.childrenMinistry?.description,
}

export default function Page() {
    return <ChildrenMinistry />
}