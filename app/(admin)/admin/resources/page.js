import { metadataObject } from "@/utils/metadata";
import Resources from "./Component";

export const metadata = {
    title: metadataObject?.resources?.title,
    description: metadataObject?.resources?.description,
}

export default function Page() {
    return <Resources />
}