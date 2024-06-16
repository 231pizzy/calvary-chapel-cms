import { metadataObject } from "@/utils/metadata";
import HomePage from "./Component";

export const metadata = {
    title: metadataObject?.homePage?.title,
    description: metadataObject?.homePage?.description,
}

export default function Page() {
    return <HomePage />
}