import { metadataObject } from "@/utils/metadata";
import Leadership from "./Component";

export const metadata = {
    title: metadataObject?.leadership?.title,
    description: metadataObject?.leadership?.description,
}

export default function Page() {
    return <Leadership />
}