const cacheConfig = require('./config/cacheConfig.json')
module.exports = function (dataId) {
    return {
        getAll: function () {
            return cacheConfig[dataId].dataBase.select.query
        },
        getResume: function () {
            return cacheConfig[dataId].dataBase.select.resumeQuery
        },
        insert: function (parameters) {
            return organizeParameters(cacheConfig[dataId].dataBase.insert, parameters)
        },
        update: function (parameters) {
            return organizeParameters(cacheConfig[dataId].dataBase.update, parameters)
        },
        delete: function (parameters) {
            return organizeParameters(cacheConfig[dataId].dataBase.delete, parameters)
        },
        getTimestamp: function (parameters) {
            return organizeParameters(cacheConfig[dataId].dataBase.getTimestamp, parameters)
        }
    }
}

const organizeParameters = function (config, parameters) {
    let query = config.query
    config.parameters.forEach((item) => {
        query = query.replace(`{@${item}}`, parameters[item])
    })
    return query
}