import { EditBoxSvg } from "@/public/icons/icons"
import { useRouter } from "next/navigation"

export default function Edit({ url }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(url)
    }

    return <EditBoxSvg onClick={handleClick}
        style={{ marginRight: '8px', cursor: 'pointer', color: 'black' }} />
}