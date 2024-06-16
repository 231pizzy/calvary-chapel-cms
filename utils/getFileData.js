import { v4 } from "uuid";

export const getFileData = ({ file, folder }) => {

    console.log('get file data received', { file, folder })

    const extension = file.name.split('.').reverse()[0];

    const fileName = `${folder}/${v4()}.${extension}`

    return { filename: fileName, file }
}