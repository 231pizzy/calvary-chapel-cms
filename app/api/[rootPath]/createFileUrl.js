export default function createFileUrl({ filename, category }) {
    return filename ? `${process.env.IMAGE_URL}?name=${category}/${filename}` : null
}