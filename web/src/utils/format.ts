import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import calenderPlugin from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

// 注册插件
dayjs.extend(updateLocale)
dayjs.extend(calenderPlugin)

// 修改语言配置
dayjs.updateLocale('zh-cn', {
  // A : 上午/下午/晚上 , dddd: 星期
  calendar: {
    lastDay: 'YYYY.MM.DD [昨天] A h:mm dddd',
    sameDay: 'YYYY.MM.DD [今天] A h:mm dddd',
    nextDay: 'YYYY.MM.DD [明天] A h:mm dddd',
    lastWeek: 'YYYY.MM.DD A h:mm [上]dddd',
    nextWeek: 'YYYY.MM.DD A h:mm [下]dddd',
    sameElse: 'YYYY.MM.DD A h:mm dddd',
  },
})

// 使用 zh-cn
dayjs.locale('zh-cn')

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(calenderPlugin)

export const formatDate = (date: string | number | Date, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  if (date) {
    return dayjs(date).format(format)
  } else {
    return ''
  }
}

export const formatDateV2 = (date: string | number | Date) => {
  if (date) {
    return dayjs(date).calendar()
  }
}

export const isBefore30Minutes = (lastMessageTime: string | number | Date, date: string | number | Date) => {
  //  date 是否是 lastMessageTime 的后 30 分钟之后
  const pre = new Date(lastMessageTime)
  const cur = new Date(date)
  if (cur.getTime() - pre.getTime() > 5 * 60 * 1000) {
    return true
  }
  return false
}
