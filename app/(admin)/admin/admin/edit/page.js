import { metadataObject } from "@/utils/metadata";
import AddAdmin from "./Component";

export const metadata = {
    title: metadataObject?.admin?.addAdminTitle,
    description: metadataObject?.admin?.addAdminDescription,
}

export default function Page() {
    return <AddAdmin />
}