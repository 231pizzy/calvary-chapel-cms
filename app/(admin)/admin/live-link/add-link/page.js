import { metadataObject } from "@/utils/metadata";
import AddView from "./Component";

export const metadata = {
    title: metadataObject?.liveLink?.addTitle,
    description: metadataObject?.liveLink?.addDescription,
}

export default function Page() {
    return <AddView />
}