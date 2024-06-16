import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.prayerTopics?.viewTitle,
    description: metadataObject?.prayerTopics?.viewDescription,
}

export default function Page() {
    return <View />
}