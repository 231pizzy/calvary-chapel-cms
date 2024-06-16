import { metadataObject } from "@/utils/metadata";
import View from "./Component";

export const metadata = {
    title: metadataObject?.prayerTopics?.title,
    description: metadataObject?.prayerTopics?.description,
}

export default function Page() {
    return <View />
}