const queryManager = require('./queryManager')
module.exports = function (dataId) {
    return {
        getAll: function () {
            return new Promise((resolve, reject) => {
                const query = queryManager(dataId).select()
                if (query) {
                    global.conn.request().query(query).then((data) => {
                        resolve(data.recordset)
                    }).catch((err) => {
                        reject(err)
                    })
                }
                else {
                    resolve({})
                }
            })
        }
    }
} 