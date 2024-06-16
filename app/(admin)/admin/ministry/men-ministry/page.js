import { metadataObject } from "@/utils/metadata";
import MenMinistry from "./Component";

export const metadata = {
    title: metadataObject?.menMinistry?.title,
    description: metadataObject?.menMinistry?.description,
}

export default function Page() {
    return <MenMinistry />
}