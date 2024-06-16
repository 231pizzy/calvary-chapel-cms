import { metadataObject } from "@/utils/metadata";
import EditHistory from "./Component";

export const metadata = {
    title: metadataObject?.resources?.editTitle,
    description: metadataObject?.resources?.editDescription,
}

export default function Page() {
    return <EditHistory />
}