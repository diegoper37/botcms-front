import instance from './instance'
import { AxiosInstance } from 'axios'

export interface Intent {
  _id: string
  name: string
}

export class IntentAPI {
  static getInstance() {
    if (IntentAPI.instance) {
      return IntentAPI.instance
    }

    return new IntentAPI(instance)
  }

  private static instance: IntentAPI
  private http: AxiosInstance

  private constructor(http: AxiosInstance) {
    this.http = http
  }

  async getIntents(): Promise<Intent[]> {
    const res = await this.http.get('/intents')
    return res.data
  }

  async createIntent(intent: Intent): Promise<Intent> {
    const res = await this.http.post('/intents', intent)
    return res.data
  }

  async updateIntent(id: string, intent: Intent): Promise<Intent> {
    const res = await this.http.put(`/intents/${id}`, intent)
    return res.data
  }

  async deleteIntent(id: string) {
    const res = await this.http.delete(`/intents/${id}`)
    return res.data
  }
}
