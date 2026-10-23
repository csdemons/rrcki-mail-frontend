import { useEffect, useMemo, useState } from 'react'
import {
  Archive, CalendarDays, ChevronDown, ChevronLeft, Circle,
  ContactRound, FilePenLine, FileText, Forward, Inbox, Mail, MessageCircle,
  Moon, MoreVertical, Paperclip, PanelLeftClose, PanelRightClose, PanelRightOpen,
  Plus, Reply, Search, Send, Settings, ShieldCheck, Star, Sun, Trash2, Users,
  X, SquarePen, Download, SlidersHorizontal, RefreshCw, BriefcaseBusiness,
} from 'lucide-react'
import { demoMessages } from './data'
import { getMessages } from './api'
import type { FolderName, MailFilter, MailMessage } from './types'

const folderItems: { name: FolderName; count?: string; icon: typeof Inbox }[] = [
  { name: 'Входящие', count: '204', icon: Inbox },
  { name: 'Черновики', count: '26', icon: FilePenLine },
  { name: 'Отправленные', count: '1', icon: Send },
  { name: 'Архив', icon: Archive },
  { name: 'Спам', icon: ShieldCheck },
  { name: 'Корзина', icon: Trash2 },
  { name: 'Помеченные', icon: Star },
]

function initials(value: string) {
  return value.trim().slice(0, 1).toUpperCase()
}

export default function App() {
  const [folder, setFolder] = useState<FolderName | 'Все' | 'Непрочитанные'>('Входящие')
  const [selectedId, setSelectedId] = useState('m-004')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<MailFilter>('Все')
  const [dark, setDark] = useState(false)
  const [foldersOpen, setFoldersOpen] = useState(true)
  const [readerOpen, setReaderOpen] = useState(true)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeMode, setComposeMode] = useState<'new' | 'reply' | 'forward'>('new')
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [notice, setNotice] = useState('')
  const [messages, setMessages] = useState<MailMessage[]>(demoMessages)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [starred, setStarred] = useState<string[]>([])
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

useEffect(() => {
  let cancelled = false

  async function loadMessages() {
    setApiLoading(true)
    setApiError('')

    try {
      const result = await getMessages('demo')

      if (!cancelled) {
        setMessages(result)

        if (result.length > 0) {
          setSelectedId((currentId) =>
            result.some((message) => message.id === currentId)
              ? currentId
              : result[0].id,
          )
        }
      }
    } catch (error) {
      if (!cancelled) {
        setApiError(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить письма',
        )
      }
    } finally {
      if (!cancelled) {
        setApiLoading(false)
      }
    }
  }

  void loadMessages()

  return () => {
    cancelled = true
  }
}, [])

async function refreshMessages() {
  setApiLoading(true)
  setApiError('')

  try {
    const result = await getMessages('demo')

    setMessages(result)

    setSelectedId((currentId) =>
      result.some((message) => message.id === currentId)
        ? currentId
        : result[0]?.id ?? '',
    )

    setNotice(`Список обновлён. Получено писем: ${result.length}.`)
  } catch (error) {
    setApiError(
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить письма',
    )
  } finally {
    setApiLoading(false)
  }
}

const visibleMessages = useMemo(() => messages.filter((message) => {
    const folderMatch =
      folder === 'Все' ? true :
      folder === 'Непрочитанные' ? message.unread :
      folder === 'Помеченные' ? starred.includes(message.id) :
      message.folder === folder
    const filterMatch =
      filter === 'Все' ? true :
      filter === 'Непрочитанные' ? message.unread :
      Boolean(message.attachment)
    const text = `${message.from} ${message.email} ${message.subject} ${message.preview}`.toLowerCase()
    return folderMatch && filterMatch && text.includes(query.toLowerCase())
  }), [messages, folder, filter, query, starred])

  const current = messages.find((message) => message.id === selectedId)
  const unreadCount = messages.filter((message) => message.unread && message.folder === 'Входящие').length

  function openComposer(mode: 'new' | 'reply' | 'forward') {
    const message = current
    setComposeMode(mode)
    setRecipient(mode === 'reply' && message ? message.email : '')
    setSubject(mode === 'reply' && message ? `Re: ${message.subject}` : mode === 'forward' && message ? `Fwd: ${message.subject}` : '')
    setBody(mode === 'reply' && message ? `\\n\\n—\\n${message.body}` : mode === 'forward' && message ? `\\n\\n---------- Пересланное сообщение ----------\\n${message.body}` : '')
    setComposeOpen(true)
    setNotice('')
  }

  function chooseMessage(message: MailMessage) {
    setSelectedId(message.id)
    setReaderOpen(true)
    setMessages((items) => items.map((item) => item.id === message.id ? { ...item, unread: false } : item))
  }

  function moveCurrent(destination: FolderName) {
    if (!current) return
    setMessages((items) => items.map((item) => item.id === current.id ? { ...item, folder: destination } : item))
    setFolder(destination)
    setNotice(`Демо: письмо перемещено в «${destination}».`)
  }

  function submitCompose(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setComposeOpen(false)
    setNotice('Демонстрация: письмо не отправлено. Для реальной отправки нужен Mail API.')
  }

  return (
    <div className={`app-shell ${dark ? 'theme-dark' : ''}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Mail size={19} fill="currentColor" /></div>
          <span>RRCKI Mail</span>
        </div>
        <button className="account-switch" onClick={() => setShowAccountMenu(!showAccountMenu)}>
          <div className="account-avatar"><Users size={20} /></div>
          <span><strong>yushkov_do@nrcki.ru</strong><small>Входящие · Exchange (демо)</small></span>
          <ChevronDown size={17} />
        </button>
        <button className="primary-button compose-top" onClick={() => openComposer('new')}>
          <SquarePen size={17} /> Новое сообщение
        </button>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Тема" onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button>
          <button className="icon-button" aria-label="Настройки" onClick={() => setShowSettings(true)}><Settings /></button>
        </div>
        {showAccountMenu && <div className="account-menu popover">
          <strong>Подключённые аккаунты</strong>
          <div className="account-menu-item"><span className="status-dot" /> yushkov_do@nrcki.ru <small>Exchange · демо</small></div>
          <button className="text-button" onClick={() => { setShowAccountMenu(false); setShowSettings(true) }}><Plus size={15} /> Добавить аккаунт</button>
        </div>}
      </header>

      <div className="workspace">
        <nav className="module-rail" aria-label="Модули">
          <button className="module active"><Mail /><span>Почта</span></button>
          <button className="module" onClick={() => setNotice('Календарь будет добавлен в следующей версии.')}><CalendarDays /><span>Календарь</span></button>
          <button className="module" onClick={() => setNotice('Контакты будут добавлены в следующей версии.')}><ContactRound /><span>Контакты</span></button>
          <button className="module" onClick={() => setNotice('Задачи будут добавлены в следующей версии.')}><FileText /><span>Задачи</span></button>
          <button className="module" onClick={() => setNotice('Чат будет добавлен в следующей версии.')}><MessageCircle /><span>Чат</span></button>
          <div className="rail-spacer" />
          <button className="module subtle-module" onClick={() => setNotice('Обратная связь пока не подключена.')}><Users /><span>Помощь</span></button>
        </nav>

        {foldersOpen && <aside className="folder-sidebar">
          <div className="sidebar-heading"><span>Основные папки</span><ChevronDown size={15} /></div>
          <div className="folder-list">
            {folderItems.map(({ name, count, icon: Icon }) => (
              <button key={name} className={`folder-item ${folder === name ? 'selected' : ''}`} onClick={() => setFolder(name)}>
                <Icon size={17} />
                <span>{name}</span>
                {name === 'Входящие' && <b className="folder-count">{unreadCount || count}</b>}
                {name !== 'Входящие' && count && <b className="folder-count muted-count">{count}</b>}
              </button>
            ))}
          </div>
          <div className="sidebar-section">
            <button className="section-toggle" onClick={() => setNotice('Групповые ящики будут доступны после реализации серверного API.')}><span>Групповая почта</span><Plus size={17} /></button>
            <button className="section-toggle" onClick={() => setNotice('Пользовательские папки синхронизируются с сервером на следующем этапе.')}><span>Мои папки</span><Plus size={17} /></button>
          </div>
          <div className="sidebar-footer">
            <div className="secure-label"><ShieldCheck size={15} /> Демо-режим</div>
            <span>Реальный сервер не подключён</span>
          </div>
        </aside>}

        <main className="message-column">
          <div className="list-toolbar">
            <button className="icon-button soft" aria-label="Показать папки" onClick={() => setFoldersOpen(!foldersOpen)}><PanelLeftClose size={18} /></button>
            <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Искать письма" /><kbd>Ctrl K</kbd></label>
            
<button
  className="icon-button soft refresh-button"
  aria-label="Обновить"
  title={apiLoading ? 'Загрузка писем...' : 'Обновить список писем'}
  disabled={apiLoading}
  onClick={() => void refreshMessages()}
>
  <RefreshCw size={17} />
</button>

          </div>
          <div className="filter-row">
            {(['Все', 'Непрочитанные', 'С вложениями'] as MailFilter[]).map((item) => (
              <button key={item} className={`filter-chip ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)}>{item}</button>
            ))}
            <button className="icon-button soft filter-settings" aria-label="Настройки фильтров" onClick={() => setNotice('Дополнительные фильтры добавим позже.')}><SlidersHorizontal size={16} /></button>
          </div>
          <div className="message-list-header"><span>{folder}</span><span>{visibleMessages.length} писем</span></div>
          <div className="message-list">
{apiLoading && (
  <div className="empty-state">
    <span>Загрузка писем с сервера...</span>
  </div>
)}

{apiError && (
  <div className="empty-state" role="alert">
    <strong>Не удалось загрузить письма</strong>
    <span>{apiError}</span>
    <button
      className="text-button"
      onClick={() => window.location.reload()}
    >
      Повторить
    </button>
  </div>
)}
            {visibleMessages.map((message, index) => (
              <button key={message.id} className={`message-row ${selectedId === message.id ? 'selected' : ''} ${message.unread ? 'unread' : ''}`} onClick={() => chooseMessage(message)}>
                <div className={`sender-avatar avatar-${index % 5}`}>{initials(message.from)}</div>
                <div className="message-summary">
                  <div className="message-topline"><span className="sender-name">{message.from}</span><time>{message.time}</time></div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-preview">{message.preview}</div>
                  <div className="message-meta">{message.attachment && <Paperclip size={13} />} {message.unread && <span className="unread-dot" />}</div>
                </div>
              </button>
            ))}
            {visibleMessages.length === 0 && <div className="empty-state"><Inbox size={30} /><strong>Письма не найдены</strong><span>Измените поисковый запрос или фильтр.</span><button className="text-button" onClick={() => { setQuery(''); setFilter('Все'); setFolder('Входящие') }}>Сбросить фильтры</button></div>}
          </div>
          <div className="list-footer"><span>{visibleMessages.length} из {messages.length} демонстрационных писем</span><span><Circle size={7} fill="#22c55e" /> Локальные данные</span></div>
        </main>

        {readerOpen && <section className="reader-pane">
          <div className="reader-toolbar">
            <button className="icon-button soft mobile-back" onClick={() => setReaderOpen(false)} aria-label="Назад"><ChevronLeft /></button>
            <div className="reader-toolbar-spacer" />
            {current && <>
              <button className={`icon-button ${starred.includes(current.id) ? 'starred' : ''}`} aria-label="Пометить" onClick={() => setStarred((items) => items.includes(current.id) ? items.filter((id) => id !== current.id) : [...items, current.id])}><Star size={19} fill={starred.includes(current.id) ? 'currentColor' : 'none'} /></button>
              <button className="icon-button" aria-label="Архивировать" onClick={() => moveCurrent('Архив')}><Archive size={18} /></button>
              <button className="icon-button" aria-label="Удалить" onClick={() => moveCurrent('Корзина')}><Trash2 size={18} /></button>
              <button className="icon-button" aria-label="Ещё" onClick={() => setNotice('Дополнительные действия появятся в следующих версиях.')}><MoreVertical size={18} /></button>
            </>}
            <button className="icon-button soft" aria-label="Скрыть чтение" onClick={() => setReaderOpen(false)}><PanelRightClose size={18} /></button>
          </div>
          {current ? <div className="reader-content">
            <div className="reader-title-row"><h1>{current.subject}</h1><span className="demo-tag">ДЕМО</span></div>
            <div className="conversation-strip"><Mail size={15} /><span>Одна демонстрационная переписка</span><ChevronDown size={15} /></div>
            <div className="sender-block">
              <div className="sender-avatar sender-avatar-large">{initials(current.from)}</div>
              <div className="sender-details"><strong>{current.from}</strong><span>{current.email}</span><span>Кому: yushkov_do@nrcki.ru</span><small>{current.time} · Только тестовые данные</small></div>
              <button className="icon-button" aria-label="Подробности" onClick={() => setNotice(`Отправитель: ${current.email}`)}><MoreVertical size={17} /></button>
            </div>
            {current.attachment && <button className="attachment-card" onClick={() => setNotice('Это демонстрационное вложение. Загрузка файла пока не реализована.')}><div className="attachment-icon"><FileText size={21} /></div><div><strong>Доступы.txt</strong><span>165 Б · TXT · демонстрация</span></div><Download size={17} /></button>}
            <article className="message-body">{current.body.split('\\n').map((line, index) => line ? <p key={`${current.id}-${index}`}>{line}</p> : <div key={`${current.id}-${index}`} className="body-spacer" />)}</article>
            <div className="reader-actions">
              <button className="primary-button" onClick={() => openComposer('reply')}><Reply size={16} /> Ответить</button>
              <button className="secondary-button" onClick={() => openComposer('forward')}><Forward size={16} /> Переслать</button>
            </div>
          </div> : <div className="empty-reader"><Mail size={42} /><strong>Выберите письмо</strong><span>Выберите сообщение в списке для просмотра.</span></div>}
        </section>}
        {!readerOpen && <button className="show-reader-button" onClick={() => setReaderOpen(true)}><PanelRightOpen size={18} /> Открыть письмо</button>}
      </div>

      {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Закрыть"><X size={16} /></button></div>}

      {composeOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposeOpen(false) }}>
        <form className="compose-modal" onSubmit={submitCompose}>
          <div className="compose-header"><div><strong>{composeMode === 'reply' ? 'Ответить на письмо' : composeMode === 'forward' ? 'Переслать письмо' : 'Новое сообщение'}</strong><small>От: yushkov_do@nrcki.ru · демо</small></div><button type="button" className="icon-button" onClick={() => setComposeOpen(false)} aria-label="Закрыть"><X size={18} /></button></div>
          <label className="compose-field"><span>Кому</span><input required type="email" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="user@rrcki.ru" /></label>
          <label className="compose-field"><span>Тема</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Тема письма" /></label>
          <textarea className="compose-body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Напишите сообщение..." />
          <div className="compose-footer"><span><Paperclip size={15} /> Вложения будут добавлены позже</span><button className="primary-button" type="submit"><Send size={16} /> Тестовая отправка</button></div>
          <p className="compose-disclaimer">Макет не отправляет почту. Реальная отправка появится после подключения Mail API.</p>
        </form>
      </div>}

      {showSettings && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSettings(false) }}>
        <div className="settings-modal">
          <div className="compose-header"><div><strong>Настройки аккаунтов</strong><small>Подключение почтовых серверов</small></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Закрыть"><X size={18} /></button></div>
          <div className="settings-account"><div className="account-avatar"><Mail size={20} /></div><div><strong>yushkov_do@nrcki.ru</strong><span>Exchange · демонстрационный аккаунт</span></div><span className="status-pill">Демо</span></div>
          <div className="settings-account"><div className="account-avatar imap-avatar"><BriefcaseBusiness size={20} /></div><div><strong>Добавить IMAP/SMTP</strong><span>Сервер, порт и метод аутентификации</span></div><button className="secondary-button" onClick={() => setNotice('Форма подключения будет реализована вместе с Mail API.')}>Настроить</button></div>
          <div className="settings-note"><ShieldCheck size={18} /><span>Не вводите реальные пароли: подключение к почте пока не реализовано.</span></div>
        </div>
      </div>}
    </div>
  )
}

