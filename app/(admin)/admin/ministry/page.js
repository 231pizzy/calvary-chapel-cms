import { metadataObject } from "@/utils/metadata";
import Ministry from "./Component";

export const metadata = {
    title: metadataObject?.ministry?.title,
    description: metadataObject?.ministry?.description,
}

export default function Page() {
    return <Ministry />
}