
import { metadataObject } from "@/utils/metadata";
import NewPasword from "./NewPassword";

export const metadata = {
    title: metadataObject?.newPassword?.title,
    description: metadataObject?.newPassword?.description,
}

export default function Page() {
    return <NewPasword />
}