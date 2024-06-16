import { metadataObject } from "@/utils/metadata";
import Dashboard from "./dashboard/Component";

export const metadata = {
    title: metadataObject?.adminDashbord?.title,
    description: metadataObject?.adminDashbord?.description,
}

export default function Page() {
    return <Dashboard />
}