import axios from "axios"
const URL = `${window.location.origin}/api/user`

export const GetUsers = async (pageParams) => {
    const result = await axios.get(URL, {
        params: pageParams,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    return result;
}

export const PostUser = async (user) => {
    const result = await axios.post(URL, user, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
    return result
}

export const GetUserById = async (id) => {
    const result = await axios.get(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
        .then((res) => res.data)
    return result
}

export const PutUser = async (user) => {
    const result = await axios.put(URL, user, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}

export const DeleteUserById = async (id) => {
    const result = await axios.delete(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => res)
        .catch(err => err.response.data)
    return result;
}

export const checkValidUser = async (id) => {
    const result = await axios.get(`${URL}/check-valid/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    return result
}