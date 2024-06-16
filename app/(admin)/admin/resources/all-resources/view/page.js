import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.allResources?.viewTitle,
    description: metadataObject?.allResources?.viewDescription,
}

export default function Page() {
    return <View />
}