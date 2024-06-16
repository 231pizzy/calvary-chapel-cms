import { metadataObject } from "@/utils/metadata";
import LogOut from "./Component";

export const metadata = {
    title: metadataObject?.adminDashbord?.title,
    description: metadataObject?.adminDashbord?.description,
}

export default function Page() {
    return <LogOut />
}