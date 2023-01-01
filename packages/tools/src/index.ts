
/**
 * 格式化日期时间
 * time 选填项, 默认: 当前时间, 时间单位ms
 * pattern 选填项, 默认格式: 'YYYY-MM-DD', YYYY|MM|DD|HH|mm分隔符进行组合
 * 返回日期格式化的日期字符
 */
export function formatDate(time: number = new Date().getTime(), pattern = 'YYYY-MM-DD'): string {
    const date: Date = new Date(time)
    const year: number = date.getFullYear()
    const month: number = date.getMonth() + 1
    const day: number = date.getDate()
    const hour: number = date.getHours()
    const minute: number = date.getMinutes()
  
    return pattern
      .replace('YYYY', `${year}`)
      .replace('MM', `${month < 10 ? `0${month}` : month}`)
      .replace('DD', `${day < 10 ? `0${day}` : day}`)
      .replace('HH', `${hour < 10 ? `0${hour}` : hour}`)
      .replace('mm', `${minute < 10 ? `0${minute}` : minute}`)
  }
  
  /**
   * 时间区间格式化规则<br/>
   * 小于 3分钟 刚刚<br/>
   * 小于 3-60 分钟区间 xx 分钟前<br/>
   * 小于 1 天 xx 小时前<br/>
   * 大于1天小于2天 昨天<br/>
   * 大于2天小于3天 前天<br/>
   * 大于3天且今年 显示 月-日<br/>
   * 不是今年 显示 年-月-日<br/>
   * startTime 必填项, 此时间为开始时间，必须小于endTime时间，时间单位ms，此参数不能超过当前时间
   * endTime 选填项, 默认为当前时间, 时间单位ms, 此参数不能超过当前时间
   * 返回格式化的日期字符
   */
  export function formatRangeTime(startTime: number, endTime: number = new Date().getTime()): string {
    const timeRange = endTime - startTime
    const wholeTime = new Date(startTime)
    const timeYear = wholeTime.getFullYear()
    const systemYear = new Date(endTime).getFullYear()
    const startDate = formatDate(startTime, 'YYYY/MM/DD')
    const oneTimeRange = endTime - new Date(startDate).getTime()
    let timeText = ''
  
    if (timeRange < 60 * 3 * 1000) {
      timeText = '刚刚'
    } else if (timeRange < 60 * 60 * 1000) {
      timeText = `${parseInt(`${timeRange / 60 / 1000}`)}分钟前`
    } else if (timeRange < 24 * 60 * 60 * 1000) {
      timeText = `${parseInt(`${timeRange / 60 / 60 / 1000}`)}小时前`
    } else if (oneTimeRange < 2 * 24 * 60 * 60 * 1000) {
      timeText = '昨天'
    } else if (oneTimeRange < 3 * 24 * 60 * 60 * 1000) {
      timeText = '前天'
    } else {
      if (systemYear === timeYear) {
        timeText = formatDate(startTime, 'MM-DD')
      } else {
        timeText = formatDate(startTime, 'YYYY-MM-DD')
      }
    }
    return timeText
  }
  
  /**
   * 根据增减天数计算时间并格式化时间
   * day 必填项, 时间单位/天，正负整数皆可
   * startTime 选填项, 计算的事件起点，默认为当前时间，时间单位ms
   * pattern 选填项, 默认格式: 'YYYY-MM-DD', YYYY|MM|DD|HH|mm分隔符进行组合
   * 返回格式化的日期字符
   */
  export function formatComputeDay(
    day: number,
    startTime: number = new Date().getTime(),
    pattern = 'YYYY-MM-DD'
  ): string {
    const milliseconds = day * 1000 * 60 * 60 * 24 + startTime
    return formatDate(milliseconds, pattern)
  }