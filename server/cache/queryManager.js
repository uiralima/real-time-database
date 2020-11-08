const cacheConfig = require('./config/cacheConfig.json')
module.exports = function (dataId) {
    return {
        getAll: function (){
            return cacheConfig[dataId].dataBase.select.query
        },
        getResume: function(){
            return cacheConfig[dataId].dataBase.select.resumeQuery
        },
        insert: function (){
            return cacheConfig[dataId].dataBase.insert.query
        },
        update:function (){
            return cacheConfig[dataId].dataBase.update.query
        },
        delete:function (){
            return cacheConfig[dataId].dataBase.delete.query
        },
        getTimestamp:function() {
            return cacheConfig[dataId].dataBase.getTimestamp.query
        } 
    }
}