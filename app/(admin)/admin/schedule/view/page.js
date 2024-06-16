import { metadataObject } from "@/utils/metadata";
import ViewSchedule from "./Component";

export const metadata = {
    title: metadataObject?.schedule?.viewTitle,
    description: metadataObject?.schedule?.viewDescription,
}

export default function Page() {
    return <ViewSchedule />
}