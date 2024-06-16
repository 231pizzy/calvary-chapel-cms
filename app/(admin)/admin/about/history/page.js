import { metadataObject } from "@/utils/metadata";
import History from "./Component";

export const metadata = {
    title: metadataObject?.history?.title,
    description: metadataObject?.history?.description,
}

export default function Page() {
    return <History />
}