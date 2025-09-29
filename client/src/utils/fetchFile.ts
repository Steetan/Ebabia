import { ChangeEvent } from "react";
import { customAxiosFile } from "./axiosFile";

export const fetchFile = async (event: ChangeEvent<HTMLInputElement>, route: string) => {
    try {
        let url = ''
        const formData = new FormData()

        if (event.target.files && event.target.files.length > 0) {
            formData.append('image', event.target.files[0]);
            await customAxiosFile(route, 'post', formData).then((data: any) => {
                url = data. url
            });
        }  
        return url
        
    } catch (error) {
        console.warn(error)
    }
}