import { metadataObject } from "@/utils/metadata";
import WomenMinistry from "./Component";

export const metadata = {
    title: metadataObject?.womenMinistry?.title,
    description: metadataObject?.womenMinistry?.description,
}

export default function Page() {
    return <WomenMinistry />
}