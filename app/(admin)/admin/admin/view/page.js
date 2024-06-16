import { metadataObject } from "@/utils/metadata";
import ViewAdmin from "./Component";

export const metadata = {
    title: metadataObject?.admin?.viewAdminTitle,
    description: metadataObject?.admin?.viewAdminDescription,
}

export default function Page() {
    return <ViewAdmin />
}