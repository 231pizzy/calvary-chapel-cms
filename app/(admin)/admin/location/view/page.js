import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.location?.viewTitle,
    description: metadataObject?.location?.viewDescription,
}

export default function Page() {
    return <View />
}