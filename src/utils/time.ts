const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export const formatTime = (date: Date | string): string => {
  try {
    const _date = typeof date == 'string' ? new Date(date) : date
    return `${_date.getHours()}:${_date.getMinutes() < 10 ? '0' : ''}${_date.getMinutes()}`
  } catch {
    return ''
  }
}

export const formatDay = (data: Date | string): string => {
  try {
    const _date = typeof data === 'string' ? new Date(data) : data
    return `${_date.getDate()}日`
  } catch {
    return ''
  }
}

export const formatDayMonth = (data: Date | string) => {
  try {
    const _date = typeof data == 'string' ? new Date(data) : data
    return `${_date.getMonth() + 1}月${_date.getDate()}日`
  } catch {
    return ''
  }
}

export const formatDayMonthYear = (data: Date | string) => {
  try {
    const _date = typeof data == 'string' ? new Date(data) : data
    return `${_date.getFullYear()}年${_date.getMonth() + 1}月${_date.getDate()}日`
  } catch {
    return ''
  }
}

export const formatMonthYear = (data: string) => {
  try {
    const [year, month] = data.split('-')
    const _date = new Date(parseInt(year), parseInt(month) - 1)
    return `${_date.getFullYear()}年${_date.getMonth() + 1}月`
  } catch {
    return ''
  }
}

export const formatDateTime = (data: string) => {
  try {
    const _date = new Date(data)
    return `${_date.getFullYear()}年${_date.getMonth() + 1}月${_date.getDate()}日 ${_date.getHours()}:${_date.getMinutes() < 10 ? '0' : ''}${_date.getMinutes()}`
  } catch {
    return ''
  }
}

export const getDay = (date: Date | string): string => {
  try {
    const _date = typeof date == 'string' ? new Date(date) : date
    return DAYS[_date.getDay()] || ''
  } catch {
    return ''
  }
}

export const sameDate = (date: Date): boolean => {
  const now = new Date()

  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  )
}

/** @example
 * const date1 = '2023-06-01'
 * const date2 = '2023-05-31'
 * console.log(isAfterDate(date1, date2)) // true
 * console.log(isAfterDate(date2, date1)) // false
 */
export const isAfterDate = (
  dateA: Date | string,
  dateB: Date | string
): boolean => {
  const _dateA = typeof dateA == 'string' ? new Date(dateA) : dateA
  const _dateB = typeof dateB == 'string' ? new Date(dateB) : dateB

  return (
    _dateA.getFullYear() > _dateB.getFullYear() ||
    (_dateA.getFullYear() === _dateB.getFullYear() &&
      _dateA.getMonth() > _dateB.getMonth()) ||
    (_dateA.getFullYear() === _dateB.getFullYear() &&
      _dateA.getMonth() === _dateB.getMonth() &&
      _dateA.getDate() > _dateB.getDate())
  )
}

export const isAfterTime = (
  timeA: Date | string,
  timeB: Date | string
): boolean => {
  const _timeA = typeof timeA == 'string' ? new Date(timeA) : timeA
  const _timeB = typeof timeB == 'string' ? new Date(timeB) : timeB

  return _timeA.getTime() > _timeB.getTime()
}

export const formatDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
