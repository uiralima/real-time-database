const queryManager = require('./queryManager')
module.exports = function (dataId) {
    return {
        getAll: function () {
            return new Promise((resolve, reject) => {
                const query = queryManager(dataId).getAll()
                log.log("Banco de dados: " + query);
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
        },
        
        getResume: function () {
            return new Promise((resolve, reject) => {
                const query = queryManager(dataId).getResume()
                log.log("Banco de dados: " + query);
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
        },

        getTimestamp: function(parameters) {
            return new Promise((resolve, reject) => {
                const query = queryManager(dataId).getTimestamp(parameters)
                
                if (query) {
                    global.conn.request().query(query).then((data) => {
                        if (data.recordset.length > 0) {
                            log.log(query + " " + data.recordset.length + " registro(s)")
                        }
                        resolve(data.recordset)
                    }).catch((err) => {
                        reject(err)
                    })
                }
                else {
                    resolve({})
                }
            })
        },

        insert: function(parameters) {
            return new Promise((resolve, reject) => {
                const query = queryManager(dataId).insert(parameters)
                log.log("Banco de dados: " + query);
                if (query) {
                    global.conn.request().query(query).then((data) => {
                        resolve(true)
                    }).catch((err) => {
                        reject(err)
                    })
                }
                else {
                    resolve(false)
                }
            })
        },

        update: function(parameters) {
            return new Promise((resolve, reject) => {
                const query = queryManager(dataId).update(parameters)
                log.log("Banco de dados: " + query);
                if (query) {
                    global.conn.request().query(query).then((data) => {
                        resolve(true)
                    }).catch((err) => {
                        reject(err)
                    })
                }
                else {
                    resolve(false)
                }
            })
        }
    }
} 