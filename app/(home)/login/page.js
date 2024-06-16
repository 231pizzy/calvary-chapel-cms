import { metadataObject } from "@/utils/metadata";
import Login from "./Component";

export const metadata = {
    title: metadataObject?.login?.title,
    description: metadataObject?.login?.description,
}

export default function Page() {
    return <Login />
}