import { metadataObject } from "@/utils/metadata";
import AddView from "./Component";

export const metadata = {
    title: metadataObject?.allResources?.addTitle,
    description: metadataObject?.schedule?.addDescription,
}

export default function Page() {
    return <AddView />
}