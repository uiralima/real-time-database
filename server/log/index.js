const fs = require('fs')

module.exports = {
    log: function(message) {
        const filename = __dirname + "/log.log"
        if (!fs.existsSync(filename)) {
            fs.writeFile(filename, message, err => {
                console.log(err || 'Arquivo salvo!')})
        }
        else {
            fs.appendFile(filename, message, err => {
                console.log(err || 'Arquivo salvo!')})
        }
    }
}