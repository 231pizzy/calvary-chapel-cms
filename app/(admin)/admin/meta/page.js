import { metadataObject } from "@/utils/metadata";
import Admin from "./Component";

export const metadata = {
    title: metadataObject?.meta?.title,
    description: metadataObject?.meta?.description,
}

export default function Page() {
    return <Admin />
}