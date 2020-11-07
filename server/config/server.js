const express = require('express')
const bodyParser = require('body-parser')
const serverData = require('./security/database.json')
const socketCreator = require('../socket/')
const cache = require('../cache/')

const app = express()

const port = 3000

const connStr = serverData.connectionString
const sql = require("mssql")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", function (req, res) {
    console.time("products")
    cache.getData('products').then((data) => res.json(data))
        .catch((err) => res.status(500).send("Erro inteno do servidor! " + err))
        .finally(() => console.timeEnd("products"))
});

let server = {}
let socket = {}

sql.connect(connStr)
    .then(conn => {
        console.log("DB Conectado!")
        global.conn = conn
        server = app.listen(port, () => console.log("Servidro ouvindo a porta " + port))
        socket = socketCreator(server)
    })
    .catch(err => console.log("erro! " + err))
cache.registerNotify("*", (message, data) => {
    socket.sendMessage(message, data)
})


module.exports = app;