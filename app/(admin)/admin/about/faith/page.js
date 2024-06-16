import { metadataObject } from "@/utils/metadata";
import Faith from "./Component";

export const metadata = {
    title: metadataObject?.faith?.title,
    description: metadataObject?.faith?.description,
}

export default function Page() {
    return <Faith />
}