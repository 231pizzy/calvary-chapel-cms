import { metadataObject } from "@/utils/metadata";
import Admin from "./Component";

export const metadata = {
    title: metadataObject?.location?.title,
    description: metadataObject?.location?.description,
}

export default function Page() {
    return <Admin />
}