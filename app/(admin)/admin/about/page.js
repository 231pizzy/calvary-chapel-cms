import { metadataObject } from "@/utils/metadata";
import About from "./Component";

export const metadata = {
    title: metadataObject?.about?.title,
    description: metadataObject?.about?.description,
}

export default function Page() {
    return <About />
}