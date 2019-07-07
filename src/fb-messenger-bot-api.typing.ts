enum ATTACHMENT_TYPE {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  FILE = 'file',
  TEMPLATE = 'template',
  FALLBACK = 'fallback',
}

export enum QUICK_REPLY_TYPE {
  TEXT = 'text',
  LOCATION = 'location',
  USER_PHONE_NUMBER = 'user_phone_number',
  USER_EMAIL = 'user_email',
}

interface AttachmentPayload {
  type: ATTACHMENT_TYPE
  payload: object
}

export interface MessagePayload {
  text?: string
  quick_replies?: IQuickReply[]
  attachment?: AttachmentPayload
}

export interface IQuickReply {
  content_type: QUICK_REPLY_TYPE
  title?: string
  payload?: string | number
  image_url?: string
}
