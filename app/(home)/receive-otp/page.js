import { metadataObject } from "@/utils/metadata";
import ReceiveOtp from "./Component";

export const metadata = {
    title: metadataObject?.passwordReset?.title,
    description: metadataObject?.passwordReset?.description,
}

export default function Page() {
    return <ReceiveOtp />
}