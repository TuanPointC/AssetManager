import axios from "axios"
const URL = `${window.location.origin}/api/return`

export const GetReturnings = async (pageParams) => {
    const result = await axios.get(URL, {
        params: pageParams, headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    return result;
}


export const PostReturningApi = async (returning) => {
    const result = await axios.post(URL, returning, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}
export const DeleteReturnId = async (id) => {
    const result = await axios.delete(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(res => res)
        .catch(err => err.response.data)

    return result;
}

export const PostComplete = async (id) => {
    const result = await axios.post(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}


export const DeleteReturningId = async (id) => {
    const result = await axios.delete(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(res => res)
        .catch(err => err.response.data)

    return result;
}

export const PostCompleteAssignment = async (modelComplete) => {
    const result = await axios.post(URL + '/complete', modelComplete, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}

