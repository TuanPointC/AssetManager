import axios from "axios"
const URL = `${window.location.origin}/api/category`

export const GetCategories = async () => {
    const result = await axios.get(URL,{
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        })
    return result;
}

export const PostCategory = async (category) => {
    const result = await axios.post(URL, category, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
    return result
}