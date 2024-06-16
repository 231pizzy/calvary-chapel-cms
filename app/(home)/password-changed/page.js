
import { metadataObject } from "@/utils/metadata";
import PasswordChanged from "./Component";


export const metadata = {
    title: metadataObject?.passwordReset?.title,
    description: metadataObject?.passwordReset?.description,
}

export default function Page() {
    return <PasswordChanged />
}