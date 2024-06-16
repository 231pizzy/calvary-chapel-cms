import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.headerFooter?.editTitle,
    description: metadataObject?.headerFooter?.editDescription,
}

export default function Page() {
    return <View />
}