import type { MailMessage } from './types'

export const demoMessages: MailMessage[] = [
  {
    id: 'm-001', accountId: 'exchange-main', folder: 'Входящие',
    from: 'Yuliya Anaschenko', email: 'y.anaschenko@next.rrcki.ru',
    subject: 'Закупка 2027 — комплектация',
    preview: 'Поделилась документом по закупке и комплектации', time: '09:31',
    body: 'Добрый день!\\n\\nНаправляю материалы по закупке на 2027 год. Посмотрите, пожалуйста, комплектацию и сообщите, если потребуются изменения.\\n\\nС уважением,\\nYuliya',
    unread: true, attachment: true,
  },
  {
    id: 'm-002', accountId: 'exchange-main', folder: 'Входящие',
    from: 'lk-new@astralinux.ru', email: 'lk-new@astralinux.ru',
    subject: 'Новые уведомления в личном кабинете',
    preview: 'Для вас доступны новые уведомления', time: '08:42',
    body: 'Здравствуйте!\\n\\nВ личном кабинете появились новые уведомления.', unread: true,
  },
  {
    id: 'm-003', accountId: 'exchange-main', folder: 'Входящие',
    from: 'lk-new@astralinux.ru', email: 'lk-new@astralinux.ru',
    subject: 'Важные меры безопасности для DCImanager 6',
    preview: 'Рекомендуем установить обновление безопасности', time: '07:12',
    body: 'Добрый день!\\n\\nОбратите внимание на рекомендации по обновлению безопасности.', unread: true,
  },
  {
    id: 'm-004', accountId: 'exchange-main', folder: 'Входящие',
    from: 'Морозов Станислав Валериевич', email: 'morozov_sv@nrcki.ru',
    subject: 'Тантор: Доступы',
    preview: 'По SSH не смог зайти на обе площадки с указанными данными авторизации',
    time: 'Вчера',
    body: 'Привет!\\n\\nПо SSH не смог зайти на обе площадки с указанными данными авторизации.\\n\\nПроверьте, пожалуйста, учётные данные и доступность площадок.',
    unread: false, attachment: true,
  },
  {
    id: 'm-005', accountId: 'exchange-main', folder: 'Входящие',
    from: 'Морозов · Храпов, Вы', email: 'team@nrcki.ru',
    subject: 'FW: Tantor или PostgreSQL для 1С',
    preview: 'Предлагаю посмотреть в сторону PostgreSQL Pro Enterprise',
    time: 'Вчера',
    body: 'Коллеги, добрый день!\\n\\nПредлагаю рассмотреть PostgreSQL Pro Enterprise для 1С и сравнить варианты по поддержке и производительности.',
    unread: true,
  },
  {
    id: 'm-006', accountId: 'exchange-main', folder: 'Входящие',
    from: 'next.nrcki.ru', email: 'office@next.nrcki.ru',
    subject: 'Nextcloud Office Document Server is unavailable',
    preview: 'The document server is unavailable', time: 'Вчера',
    body: 'Nextcloud Office Document Server is unavailable. Проверьте доступность сервиса.',
    unread: false,
  },
  {
    id: 'm-007', accountId: 'exchange-main', folder: 'Черновики',
    from: 'Вы', email: 'yushkov_do@nrcki.ru',
    subject: 'План работ на неделю', preview: 'Черновик письма — подготовить план',
    time: 'Пн', body: 'Подготовить план работ на неделю.', unread: false,
  },
  {
    id: 'm-008', accountId: 'exchange-main', folder: 'Архив',
    from: 'Служба ИТ', email: 'it@rrcki.ru',
    subject: 'Сервисное уведомление', preview: 'Информация о плановых работах',
    time: 'Пн', body: 'Информируем о плановых работах.', unread: false,
  },
]
