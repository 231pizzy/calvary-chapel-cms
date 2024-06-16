import generateFileUrl from "./getImageUrl"

export default function imageFromFile({ file }) {
    console.log('getting image from file', file)
    return file && ((file instanceof Blob) ? URL.createObjectURL(file) : generateFileUrl(file))
}