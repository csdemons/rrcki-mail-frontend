export type FolderName =
  | 'Входящие'
  | 'Черновики'
  | 'Отправленные'
  | 'Архив'
  | 'Спам'
  | 'Корзина'
  | 'Помеченные'

export type MailFilter = 'Все' | 'Непрочитанные' | 'С вложениями'

export interface MailMessage {
  id: string
  accountId: string
  folder: FolderName
  from: string
  email: string
  subject: string
  preview: string
  time: string
  body: string
  unread: boolean
  attachment?: boolean
}
