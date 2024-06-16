import { metadataObject } from "@/utils/metadata";
import Admin from "./Component";

export const metadata = {
    title: metadataObject?.admin?.title,
    description: metadataObject?.admin?.description,
}

export default function Page() {
    return <Admin />
}