import { uploadFile } from "@/utils/uploadFile";

export default async function upload({ file, filename, category }) {
    try {
        let arrayToSave = null;

        console.log('data received by upload function', { file, filename, category })

        const getFileData = ({ file, filename }) => {

            const extension = file.name.split('.').reverse()[0];

            const realFileName = filename.split('.')[0];

            const fileName = `${crypto.randomUUID()}.${extension}`

            arrayToSave = { name: realFileName, filename: fileName, extension: extension };

            return { filename: fileName, filedata: file }
        }

        const handleUpload = async ({ file, filename, category }) => {
            console.log('handleUpload', { file, filename, category })
            const fileData = getFileData({ file, filename });

            const data = await fileData?.filedata?.arrayBuffer();
            const buffer = Buffer.from(data);

            await uploadFile({
                fileName: `${category}/${fileData.filename}`,
                fileStream: buffer
            });
        }

        await handleUpload({ file, category, filename });

        return { saved: true, data: arrayToSave }
    } catch (error) {
        console.log('error saving file', error)
        return { saved: false }
    }
}