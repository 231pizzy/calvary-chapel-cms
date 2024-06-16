import { metadataObject } from "@/utils/metadata";
import Resources from "./Component";

export const metadata = {
    title: metadataObject?.schedule?.title,
    description: metadataObject?.schedule?.description,
}

export default function Page() {
    return <Resources />
}