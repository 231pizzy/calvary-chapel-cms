import { metadataObject } from "@/utils/metadata";
import BibleCharacters from "./Component";

export const metadata = {
    title: metadataObject?.bibleCharacter?.title,
    description: metadataObject?.bibleCharacter?.description,
}

export default function Page() {
    return <BibleCharacters />
}