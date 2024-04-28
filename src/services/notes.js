import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(res => res.data)
}

const create = async (item) => {
    const config = {
        headers: { Authorization: token}
    }
    const res = await axios.post(baseUrl, item, config)
    return res.data
}

const update = (id, item) => {
    const req = axios.put(`${baseUrl}/${id}`, item)
    return req.then(res => res.data)
}

export default { getAll, create, update, setToken }