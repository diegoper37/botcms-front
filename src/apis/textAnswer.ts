import instance from './instance'
import { AxiosInstance } from 'axios'

export interface TextAnswer {
  _id: string
  name: string
  intents: string[]
}

export class TextAnswerAPI {
  static getInstance() {
    if (TextAnswerAPI.instance) {
      return TextAnswerAPI.instance
    }

    return new TextAnswerAPI(instance)
  }

  private static instance: TextAnswerAPI
  private http: AxiosInstance

  private constructor(http: AxiosInstance) {
    this.http = http
  }

  async getTextAnswers(): Promise<TextAnswer[]> {
    const res = await this.http.get('/text-answer')
    return res.data
  }

  async createTextAnswer(textanswer: TextAnswer): Promise<TextAnswer> {
    const res = await this.http.post('/text-answer', textanswer)
    return res.data
  }

  async updateTextAnswer(id: string, textanswer: TextAnswer): Promise<TextAnswer> {
    const res = await this.http.put(`/text-answer/${id}`, textanswer)
    return res.data
  }

  async deleteTextAnswer(id: string) {
    const res = await this.http.delete(`/text-answer/${id}`)
    return res.data
  }
}
