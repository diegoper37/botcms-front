import instance from './instance'
import { AxiosInstance } from 'axios'

export interface TextContent {
  _id: string
  name: string
  intents: string[]
}

export class TextContentAPI {
  static getInstance() {
    if (TextContentAPI.instance) {
      return TextContentAPI.instance
    }

    return new TextContentAPI(instance)
  }

  private static instance: TextContentAPI
  private http: AxiosInstance

  private constructor(http: AxiosInstance) {
    this.http = http
  }

  async getTextContents(): Promise<TextContent[]> {
    const res = await this.http.get('/text-contents')
    return res.data
  }

  async createTextContent(textcontent: TextContent): Promise<TextContent> {
    const res = await this.http.post('/text-contents', textcontent)
    return res.data
  }

  async updateTextContent(id: string, textcontent: TextContent): Promise<TextContent> {
    const res = await this.http.put(`/text-contents/${id}`, textcontent)
    return res.data
  }

  async deleteTextContent(id: string) {
    const res = await this.http.delete(`/text-contents/${id}`)
    return res.data
  }
}
