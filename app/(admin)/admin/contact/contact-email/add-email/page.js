import { metadataObject } from "@/utils/metadata";
import AddView from "./Component";

export const metadata = {
    title: metadataObject?.contactEmail?.addTitle,
    description: metadataObject?.contactEmail?.addDescription,
}

export default function Page() {
    return <AddView />
}