import { metadataObject } from "@/utils/metadata";
import Schedule from "./Component";

export const metadata = {
    title: metadataObject?.schedule?.title,
    description: metadataObject?.schedule?.description,
}

export default function Page() {
    return <Schedule />
}