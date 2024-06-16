import { metadataObject } from "@/utils/metadata";
import EditView from "./Component";

export const metadata = {
    title: metadataObject?.allResources?.editTitle,
    description: metadataObject?.allResources?.editDescription,
}

export default function Page() {
    return <EditView />
}