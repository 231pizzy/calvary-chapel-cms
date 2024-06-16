import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.contactEmail?.viewTitle,
    description: metadataObject?.contactEmail?.viewDescription,
}

export default function Page() {
    return <View />
}