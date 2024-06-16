import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.liveLink?.viewTitle,
    description: metadataObject?.liveLink?.viewDescription,
}

export default function Page() {
    return <View />
}