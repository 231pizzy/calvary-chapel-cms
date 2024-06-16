import { metadataObject } from "@/utils/metadata";
import GuestSpeakers from "./Component";

export const metadata = {
    title: metadataObject?.guestSpeaker?.title,
    description: metadataObject?.guestSpeaker?.description,
}

export default function Page() {
    return <GuestSpeakers />
}