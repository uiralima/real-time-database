const cache = require('../cache/')
const cacheNotificationControl = {}

module.exports = (server) => {
    const io = require('socket.io').listen(server);
    const productsNamespace = io.of('/products');

    /*io.on('connection', function (socket) {
        log.log("Usuário conectou!");
        socket.on('disconnect', function () {
            log.log("Usuário desconectou!");
        })

    });*/
    productsNamespace.on('connection', function (socket) {
        log.log("Usuário conectou! em produtos");
        const newNamespace = socket.nsp;
        cache.getData("products").then((data) => {
            newNamespace.emit("cache-products", data);

        })
        socket.on('disconnect', function () {
            log.log("Usuário desconectou de proditos!");
        })
    })
    const socket = {
        sendMessage: function (message, data) {
            if (message.indexOf('cache-') === 0) {
                productsNamespace.emit(message, data)
            }
            else {
                io.emit(message, data)
            }
        },

        registerTo: function (message, func) {
            io.on(message, func(data))
        }
    }
    return socket
    /*setInterval(() => {
    io.emit("Ping", {timestamp: (+new Date())})
}, 2000);*/
}