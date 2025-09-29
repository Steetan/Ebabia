import { customAxiosFile } from "./axiosFile"

export const deleteImg = (setImgUrl: any, inputFileRef: any, route: string) => {
        try {
            customAxiosFile(route, 'delete')
            if (inputFileRef.current) {
                inputFileRef.current.value = ''
            }
            setImgUrl('')
        } catch (error) {
            console.log(error)
        }
    }