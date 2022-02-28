import axios from "axios"
const URL = `${window.location.origin}/api/account/`


export const PostLogin = user => {
    const result = axios.post(URL + 'login', user, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}
export const ChangePasswordApi = async (passwordParams) => {
    const result = await axios.post(URL + 'changepassword', passwordParams, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}

export const ChangePasswordFirstLoginApi = async (passwordParams) => {
    const result = await axios.post(URL + 'changepasswordfirstlogin', passwordParams, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}