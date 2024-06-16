
export async function uploadFile({ fileArray, callback }) {
    const fileUploader = async (fileArray) => {
        if (!fileArray?.length) return callback()

        const { filename, file } = fileArray.pop()
        //Get the signed url
        const response = await fetch(`/api/get-signed-url?filename=${filename}`, { method: 'GET' });
        const { result } = await response.json();

        console.log('signed url obtained', result)

        if (result) {
            console.log('uploading the file', filename)
            //Upload the file to the url
            const response2 = await fetch(result, {
                method: 'PUT',
                //   headers: { /* 'Content-Type': file?.type, */ 'Access-Control-Allow-Origin': '*' },
                body: file
            })
            if (response2.ok) {
                console.log('file uploaded for ', filename)
                fileArray.length ? await fileUploader(fileArray) : callback()
            }
            else {
                console.log('issue uploading file', filename)
            }
        }
    }

    return fileUploader(fileArray)
}
