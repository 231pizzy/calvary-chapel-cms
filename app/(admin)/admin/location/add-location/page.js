import { metadataObject } from "@/utils/metadata";
import AddView from "./Component";

export const metadata = {
    title: metadataObject?.location?.addTitle,
    description: metadataObject?.location?.addDescription,
}

export default function Page() {
    return <AddView />
}