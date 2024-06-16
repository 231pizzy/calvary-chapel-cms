import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.liveLink?.title,
    description: metadataObject?.liveLink?.description,
}

export default function Page() {
    return <View />
}