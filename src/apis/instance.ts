import axios from 'axios'

const instance = axios.create({
  baseURL: `${process.env.VUE_APP_API || ''}/api/v1`,
})

export default instance
