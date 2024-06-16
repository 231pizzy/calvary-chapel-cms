import { metadataObject } from "@/utils/metadata";
import EditMenMinistry from "./Component";

export const metadata = {
    title: metadataObject?.menMinistry?.editTitle,
    description: metadataObject?.menMinistry?.editDescription,
}

export default function Page() {
    return <EditMenMinistry />
}