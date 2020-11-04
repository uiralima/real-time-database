let express = require('express');
const bodyParser = require('body-parser');

let app = express();

let port = 3000;

/*const sql = require("mssql");
sql.connect(connStr)
    .then(conn => global.conn = conn)
    .catch(err => console.log("erro! " + err));*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let server = app.listen(port, () => console.log("Servidro ouvindo a porta " + port));

let io = require('socket.io').listen(server);

io.on('connection', function(socket) {
    console.log("Usuário conectou!");
    socket.on('disconnect', function() {
        console.log("Usuário desconectou!");
    })
    /*socket.on("novaMensagem", function(data) {
        io.emit('registraMensagem', {apelido: data.apelido, msg: data.msg});
        io.emit('atualizaParticipantes', {apelido: data.apelido});
        //io.broadcast.emit('registraMensagem', {apelido: data.apelido, msg: data.msg});
    });*/

});

/*setInterval(() => {
    io.emit("Ping", {timestamp: (+new Date())})
}, 2000);*/

app.get("/", function (req, res) {
    res.send("Servidor respondendo !!!!!");
    return;
});

/*app.get("/api/:table", (req, res) => {
    global.conn.request().query(`SELECT * FROM Ticket 
    SELECT * FROM ${req.params.table}`)
        .then(result => res.json(result))
        .catch(err => res.json(err));
})*/

app.get("/newItem", function(req, res) {
    let next = Itens.length + 1
    Itens.push({id: next, name: `Nome ${(next < 10 ? '0' + next.toString() : next.toString())}`});
    io.emit("ItensChanged", Itens);
    res.send("Item Inserido !!!!!");
    return;
})

const Itens = [
    {id: 1, name: "Nome 01"},
    {id: 2, name: "Nome 02"}
];

module.exports = app;