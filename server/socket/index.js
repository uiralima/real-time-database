const cache = require('../cache/')
const cacheNotificationControl = {}
const log = require('../log/')
module.exports = (server) => {
    const io = require('socket.io').listen(server);
    const productsNamespace = io.of('/products');

    io.on('connection', function (socket) {
        console.log("Usuário conectou!");
        //console.log(socket)
        /*if ((socket.handshake) && (socket.handshake.query) && (socket.handshake.query) && (socket.handshake.query.messages)){
            const newNamespace = socket.nsp;
            socket.handshake.query.messages.split(',').forEach((message) => {
                if (message.indexOf('cache-') === 0) {
                    if (cacheNotificationControl[message]) {
                        cacheNotificationControl[message].push(socket)
                    }
                    else {
                        cacheNotificationControl[message] = [socket]
                    }
                    //log.log(cacheNotificationControl[message])
                    
                    })
                }
            })
        }*/
        socket.on('disconnect', function () {
            console.log("Usuário desconectou!");
        })

    });
    productsNamespace.on('connection', function (socket) {
        console.log("Usuário conectou! em produtos");
        const newNamespace = socket.nsp;
        cache.getData("products").then((data) => {
            newNamespace.emit("cache-products", data);

        })
        socket.on('disconnect', function () {
            console.log("Usuário desconectou!");
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