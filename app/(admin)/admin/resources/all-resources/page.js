import { metadataObject } from "@/utils/metadata";
import AllResources from "./Component";

export const metadata = {
    title: metadataObject?.allResources?.title,
    description: metadataObject?.allResources?.description,
}

export default function Page() {
    return <AllResources />
}