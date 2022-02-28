import axios from "axios"
const URL = `${window.location.origin}/api/asset`
const token = localStorage.getItem('token');

export const GetAssets = async (pageParams) => {
    const result = await axios.get(URL, {
        params: pageParams,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}


export const PostAsset = async (asset) => {
    const result = await axios.post(URL, asset, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => res)
    return result
}

export const DeleteAssetById = async (id) => {
    const result = await axios.delete(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => res)
        .catch(err => err.response.data)
    return result;
}

export const GetAssetById = async (id) => {
    const result = await axios.get(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
        .then((res) => res.data)
    return result
}

export const PutAsset = async (asset) => {
    const result = await axios.put(URL, asset, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
    return result
}
