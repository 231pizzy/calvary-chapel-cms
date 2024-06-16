import { metadataObject } from "@/utils/metadata";
import Admin from "./Component";

export const metadata = {
    title: metadataObject?.headerFooter?.title,
    description: metadataObject?.headerFooter?.description,
}

export default function Page() {
    return <Admin />
}