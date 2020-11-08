function toFormatedString(format) {
    const now = new Date()
    if (format.indexOf('yyyy') >= 0) {
        format = format.replace('yyyy', now.getFullYear())
    }
    if (format.indexOf('MM') >= 0) {
        const month = now.getMonth() + 1
        format = format.replace('MM', ((month > 9) ? month.toString() : '0' + month.toString()))
    }
    if (format.indexOf('dd') >= 0) {
        const day = now.getDate()
        format = format.replace('dd', ((day > 9) ? day.toString() : '0' + day.toString()))
    }
    if (format.indexOf('hh') >= 0) {
        const hour = now.getHours()
        format = format.replace('hh', ((hour > 9) ? hour.toString() : '0' + hour.toString()))
    }
    if (format.indexOf('mm') >= 0) {
        const minute = now.getMinutes()
        format = format.replace('mm', ((minute > 9) ? minute.toString() : '0' + minute.toString()))
    }
    if (format.indexOf('ss') >= 0) {
        const second = now.getSeconds()
        format = format.replace('ss', ((second > 9) ? second.toString() : '0' + second.toString()))
    }
    return format
} 

module.exports = { toFormatedString }