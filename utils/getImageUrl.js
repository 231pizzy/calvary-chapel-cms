export default function generateFileUrl(filename) {
    console.log('received file', filename)
    return (filename instanceof Blob) ? filename : `https://brilloconnetz.fra1.digitaloceanspaces.com/calvaryChapel/${filename}`
}