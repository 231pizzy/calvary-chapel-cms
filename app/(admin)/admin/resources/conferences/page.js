import { metadataObject } from "@/utils/metadata";
import Conferences from "./Component";

export const metadata = {
    title: metadataObject?.conferences?.title,
    description: metadataObject?.conferences?.description,
}

export default function Page() {
    return <Conferences />
}