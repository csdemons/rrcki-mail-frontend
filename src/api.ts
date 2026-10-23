
import type { MailMessage, FolderName } from './types'

const API_BASE = import.meta.env.VITE_MAIL_API_URL || '/api/v1'

interface ApiMessage {
  id: string
  accountId: string
  folder: string
  fromName: string
  fromAddress: string
  subject: string
  preview: string
  bodyText: string
  receivedAt: string
  unread: boolean
  starred: boolean
  hasFiles: boolean
}

interface ApiListResponse {
  items: ApiMessage[]
  total: number
  limit: number
  offset: number
}

function formatTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const today = new Date()

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  })
}

function mapMessage(item: ApiMessage): MailMessage {
  const allowedFolders: FolderName[] = [
    'Входящие',
    'Черновики',
    'Отправленные',
    'Архив',
    'Спам',
    'Корзина',
    'Помеченные',
  ]

  const folder = allowedFolders.includes(item.folder as FolderName)
    ? (item.folder as FolderName)
    : 'Входящие'

  return {
    id: item.id,
    accountId: item.accountId,
    folder,
    from: item.fromName || item.fromAddress,
    email: item.fromAddress,
    subject: item.subject,
    preview: item.preview || '',
    time: formatTime(item.receivedAt),
    body: item.bodyText || '',
    unread: item.unread,
    attachment: item.hasFiles,
  }
}

export async function getMessages(
  accountId = 'demo',
): Promise<MailMessage[]> {
  const response = await fetch(
    `${API_BASE}/accounts/${encodeURIComponent(accountId)}/messages`,
  )

  if (!response.ok) {
    throw new Error(`Ошибка загрузки писем: HTTP ${response.status}`)
  }

  const data = (await response.json()) as ApiListResponse
  return data.items.map(mapMessage)
}
