
import { metadataObject } from "@/utils/metadata";
import SendingToken from "./SendingToken";

export const metadata = {
    title: metadataObject?.passwordReset?.title,
    description: metadataObject?.passwordReset?.description,
}

export default function Page() {
    return <SendingToken />
}