import IndexPage from "@/Components/IndexPage"
import { metadataObject } from "@/utils/metadata"

export const metadata = {
    title: metadataObject?.home?.title,
    description: metadataObject?.home?.description,
}

export default function Page() {
    return <IndexPage />
}