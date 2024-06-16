import { metadataObject } from "@/utils/metadata";
import Admin from "./Component";

export const metadata = {
    title: metadataObject?.meta?.editTitle,
    description: metadataObject?.meta?.editDescription,
}

export default function Page() {
    return <Admin />
}