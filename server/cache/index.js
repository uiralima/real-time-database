const dataManager = require('./dataManager')
const cache = {}
const observers = {}
const cacheConfig = require('./config/cacheConfig.json')
const stringUtils = require('../utils/string')
const timestampsToCheck = []
let started = false;

module.exports = {

    registerNotify: function (message, callback) {
        const id = stringUtils.uuidv4()
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
                resolve(result)
            }).catch((err) => reject(err))
        })
    },

    getResume: function (dataId) {
        return new Promise((resolve, reject) => {
            checkCache(dataId, true).then((result) => {
                if (cacheConfig[dataId].isCacheable) {
                    resolve(cache["resume-" + dataId])
                }
                else {
                    //resolve(result.map((item) => getResume(dataId, item)))
                    resolve(result)
                }
            }).catch((err) => reject(err))
        })
    }
}

const checkCache = function (dataId, isResume = false) {
    return new Promise((resolve, reject) => {
        if (cacheConfig[dataId].isCacheable) {
            if (cache[dataId]) {
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

const cacheMachine = function () {
    const promises = []
    timestampsToCheck.forEach(item => promises.push(checkTimestamp(item)))
    Promise.all(promises)
    .then(() => { })
    .catch((err) => {
        log.log(err);
    })
    .finally(() => {
        setTimeout(() => {
            cacheMachine()
        }, 2000)
    })
}

const checkTimestamp = function (dataId) {
    return new Promise((resolve, reject) => {
        if (cache[dataId]) { 
            if (cacheConfig[dataId].checkTimestamp) {
                dataManager(dataId).getTimestamp({timestamp: cache["timestamp-" + dataId]})
                    .then((alteredRows) => {
                        alteredRows.forEach((item) => {
                            const index = cache[dataId].findIndex((cacheItem) => cacheItem[cacheConfig[dataId].id] === item[cacheConfig[dataId].id])
                            if (index >= 0) {
                                cache[dataId][index] = item
                            }
                            else {
                                cache[dataId].push(item) 
                            }
                        })
                        if (alteredRows.length > 0) {
                            setData(dataId, cache[dataId])
                        }
                        resolve(cache[dataId])
                    }).catch(err => reject(err))
            }
            else {
                resolve(cache[dataId])
            }
        }
        else {
            resolve([])
        }
    })
}

const setData = function (dataId, data) {
    cache[dataId] = data
    cache["resume-" + dataId] = cache[dataId].map(item => getResume(dataId, item))
    if (cacheConfig[dataId].checkTimestamp) {
        cache["timestamp-" + dataId] = getCacheTimestamp(dataId, data)
        log.log("Atribuindo cache: " + cache["timestamp-" + dataId])
        if (timestampsToCheck.indexOf(dataId) < 0) { 
            timestampsToCheck.push(dataId)
        }
    }
    Object.values(observers).forEach((observer) => {
        if ((observer.message === "*") || (observer.message === dataId)) {
            observer.callback("cache-" + dataId, data)
        }
    })
    if (!started) {
        cacheMachine()
        started = true;
    }
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

