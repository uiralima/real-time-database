module.exports = function (dataId) {
    return {
        select: function (){
            if (dataId === "products") {
                return `SELECT * FROM teste_cache`
            }
            else {
                return ""
            }
        }
    }
}