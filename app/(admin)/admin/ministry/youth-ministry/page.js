import { metadataObject } from "@/utils/metadata";
import YouthMinistry from "./Component";

export const metadata = {
    title: metadataObject?.youthMinistry?.title,
    description: metadataObject?.youthMinistry?.description,
}

export default function Page() {
    return <YouthMinistry />
}