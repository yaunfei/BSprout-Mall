import dayjs from 'dayjs';

// string date转为时间戳
export function stringToTimestamp(value: string) {
  if (!value) return;
  return dayjs(value).valueOf();
}

// 时间戳转为date, 格式化
export function timestampToString(
  value: number,
  format = 'YYYY-MM-DD HH:mm:ss'
) {
  if (!value) return;
  const year = dayjs(value).year();
  const month = dayjs(value).month() + 1;
  const date = dayjs(value).date();
  const hour = dayjs(value).hour();
  const minute = dayjs(value).minute();
  const second = dayjs(value).second();
  const relustDate = dayjs(
    `${year}-${month}-${date} ${hour}:${minute}:${second}`
  ).format(format);

  return relustDate;
}
