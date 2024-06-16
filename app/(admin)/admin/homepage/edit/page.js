import { metadataObject } from "@/utils/metadata";
import EditHomepage from "./Component";

export const metadata = {
    title: metadataObject?.homePage?.editTitle,
    description: metadataObject?.homePage?.editDescription,
}

export default function Page() {
    return <EditHomepage />
}