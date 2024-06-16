import { metadataObject } from "@/utils/metadata";
import TopicalCharacters from "./Component";

export const metadata = {
    title: metadataObject?.topicalCharacter?.title,
    description: metadataObject?.topicalCharacter?.description,
}

export default function Page() {
    return <TopicalCharacters />
}