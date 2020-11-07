const dataManager = require('./dataManager')
const cache = {}
const observers = {}
module.exports = {

    registerNotify: function(message, callback) {
        const id = uuidv4()
        observers[id] = {
            callback,
            message
        }
        return id
    },

    unregister: function(id) {
        delete observers[id]
    },

    insertData(dataId, data) {
        //Faz o insert 
    },

    getData: function(dataId) {
        return new Promise((resolve, reject) => {
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
        })
    }, 
}

const setData = function(dataId, data) {
    cache[dataId] = data
    Object.values(observers).forEach((observer) => {
        if ((observer.message === "*") || (observer.message === dataId)) {
            observer.callback("cache-" + dataId, data)
        } 
    })
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    });
}