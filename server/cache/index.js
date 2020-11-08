const dataManager = require('./dataManager')
const cache = {}
const observers = {}
const cacheConfig = require('./config/cacheConfig.json')
const fileUtils = require('../utils/object')
module.exports = {

    registerNotify: function (message, callback) {
        const id = uuidv4()
        observers[id] = {
            callback,
            message
        }
        return id
    },

    unregister: function (id) {
        delete observers[id]
    },

    insertData(dataId, data) {
        //Faz o insert 
    },

    getData: function (dataId) {
        return new Promise((resolve, reject) => {

            checkCache(dataId).then((result) => {
                log.log(fileUtils.objsctSize(result))
                resolve(result)
            }).catch((err) => reject(err))
        })
    },

    getResume: function (dataId) {
        return new Promise((resolve, reject) => {
            checkCache(dataId, true).then((result) => {
                log.log(fileUtils.objsctSize(result))
                if (cacheConfig[dataId].isCacheable) {
                    resolve(cache["resume-" + dataId])
                }
                else {
                    resolve(result.map((item) => getResume(dataId, item)))
                }
            }).catch((err) => reject(err))
        })
    }
}

const checkCache = function (dataId, isResume = false) {
    return new Promise((resolve, reject) => {
        if (cacheConfig[dataId].isCacheable) {
            if (cache[dataId]) {
                if (cacheConfig[dataId].checkTimestamp) {
                    dataManager(dataId).getTimestamp()
                        .then((ts) => {
                            if (ts === cache["timestamp-" + dataId]) {
                                resolve(cache[dataId])
                            }
                            else {
                                dataManager(dataId).getAll()
                                    .then(result => {
                                        setData(dataId, result)
                                        resolve(cache[dataId])
                                    })
                                    .catch(err => reject(err));
                            }
                        }
                        )
                }
                else {
                    resolve(cache[dataId])
                }
            }
            else {
                dataManager(dataId).getAll()
                    .then(result => {
                        setData(dataId, result)
                        resolve(cache[dataId])
                    })
                    .catch(err => reject(err));
            }
        }
        else {
            if (isResume) {
                dataManager(dataId).getResume()
                    .then(result => {
                        setData(dataId, result)
                        resolve(cache[dataId])
                    })
                    .catch(err => reject(err));
            }
            else {
                dataManager(dataId).getAll()
                    .then(result => {
                        resolve(result)
                    })
                    .catch(err => reject(err));
            }
        }
    })
}

const setData = function (dataId, data) {
    cache[dataId] = data
    cache["resume-" + dataId] = cache[dataId].map(item => getResume(dataId, item))
    if (cacheConfig[dataId].checkTimestamp) {
        cache["timestamp-" + dataId] = getCacheTimestamp(dataId, data)
        log.log("Atribuindo cache: " + cache["timestamp-" + dataId])
    }
    Object.values(observers).forEach((observer) => {
        if ((observer.message === "*") || (observer.message === dataId)) {
            observer.callback("cache-" + dataId, data)
        }
    })
}

const getResume = function (dataId, data) {
    const result = {}
    cacheConfig[dataId].resume.forEach((field) => result[field] = data[field])
    return result
}

const getCacheTimestamp = function (dataId, data) {
    const timestampField = cacheConfig[dataId].checkTimestamp
    return data.reduce((lastValue, item) => {
        if (item[timestampField] > lastValue) {
            return item[timestampField]
        }
        else {
            return lastValue
        }
    }, 0)
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    });
}