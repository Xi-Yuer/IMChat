import dayjs from 'dayjs'

export const formatDate = (
  date: string | number | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
) => {
  if (date) {
    return dayjs(date).format(format)
  } else {
    return ''
  }
}
