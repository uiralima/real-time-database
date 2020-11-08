const fs = require('fs')
const path = require('path')
const dateUtils = require('../utils/date')

module.exports = {
    log: function(message) {
        const filename = path.join(__dirname, `/log_${dateUtils.toFormatedString("yyyyMMdd")}.log`)
        if (!fs.existsSync(filename)) {
            fs.writeFile(filename, `[${dateUtils.toFormatedString("dd/MM/yyyy hh:mm:ss")}] - ${message}`, err => { })
        }
        else {
            fs.appendFile(filename, `\n[${dateUtils.toFormatedString("dd/MM/yyyy hh:mm:ss")}] - ${message}`, err => { })
        }
    }
}