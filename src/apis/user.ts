import instance from './instance'
import { AxiosInstance } from 'axios'

export interface User {
  _id: string
  profile: {
    firstName: string
    lastName: string
  }
  role: string
  email: string
  password: string
  token?: string
}

export class UserAPI {
  static getInstance() {
    if (UserAPI.instance) {
      return UserAPI.instance
    }

    return new UserAPI(instance)
  }

  private static instance: UserAPI
  private http: AxiosInstance

  private constructor(http: AxiosInstance) {
    this.http = http
  }

  async login(email: string, password: string) {
    try {
      const res = await this.http.post('/auth/login', { email, password })
      return res.data
    } catch (error) {
      return error
    }
  }
  async register(user: User) {
    try {
      const res = await this.http.post('/auth/register', user)
      return res.data
    } catch (error) {
      return error
    }
  }

  async getUsers(): Promise<User[]> {
    const res = await this.http.get('/users')
    return res.data
  }

  async updateUser(id: string, user: User): Promise<User> {
    const res = await this.http.put(`/users/${id}`, user)
    return res.data
  }

  async deleteUser(id: string) {
    const res = await this.http.delete(`/users/${id}`)
    return res.data
  }
}
