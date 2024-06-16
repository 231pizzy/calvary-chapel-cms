import { metadataObject } from "@/utils/metadata";
import EditHistory from "./Component";

export const metadata = {
    title: metadataObject?.history?.editTitle,
    description: metadataObject?.history?.editDescription,
}

export default function Page() {
    return <EditHistory />
}