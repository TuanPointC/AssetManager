import axios from "axios"
const URL = `${window.location.origin}/api/assignment`

export const GetAssignments = async (pageParams) => {
    const result = await axios.get(URL, {
        params: pageParams, headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then(res=>res)
    return result;
}


export const PostAssignment = async (assignment) => {
    const result = await axios.post(URL, assignment, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}
export const PostChangeStateAssignment = async (data) => {
    const result = await axios.post(URL + '/accept', data, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}



export const DeleteAssignmentId = async (id) => {
    const result = await axios.delete(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(res => res)
        .catch(err => err.response.data)

    return result;
}

export const GetAssignmentById = async (id) => {
    const result = await axios.get(URL + '/' + id, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
        .then((res) => res.data)
    return result
}

export const PutAssignment = async (assignment) => {
    const result = await axios.put(URL, assignment, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((res) => res)
        .catch(err => err.response.data)
    return result
}
