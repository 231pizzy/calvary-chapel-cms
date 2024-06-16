import { metadataObject } from "@/utils/metadata";
import AddView from "./Component";

export const metadata = {
    title: metadataObject?.prayerTopics?.addTitle,
    description: metadataObject?.prayerTopics?.addDescription,
}

export default function Page() {
    return <AddView />
}