import { metadataObject } from "@/utils/metadata";
import EditHomepage from "./Component";

export const metadata = {
    title: metadataObject?.schedule?.editTitle,
    description: metadataObject?.schedule?.editDescription,
}

export default function Page() {
    return <EditHomepage />
}