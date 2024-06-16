import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.contactEmail?.title,
    description: metadataObject?.contactEmail?.description,
}

export default function Page() {
    return <View />
}