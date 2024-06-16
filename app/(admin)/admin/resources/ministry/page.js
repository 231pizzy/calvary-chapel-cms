import { metadataObject } from "@/utils/metadata";
import ResourceMinistry from "./Component";

export const metadata = {
    title: metadataObject?.resourceMinistry?.title,
    description: metadataObject?.resourceMinistry?.description,
}

export default function Page() {
    return <ResourceMinistry />
}