let express = require('express');
const bodyParser = require('body-parser');

let app = express();

let port = 3000;

const connStr = "Server=198.71.225.113;Database=rqe_bolao2020;User Id=raique;Password=&Rqe&016679;";
const sql = require("mssql");
sql.connect(connStr)
    .then(conn => global.conn = conn)
    .catch(err => console.log("erro! " + err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port);

console.log("Servidro ouvindo a porta " + port);

app.get("/", function (req, res) {
    res.send("Servidor respondendo !!!!!");
    return;
});

app.get("/api/:table", (req, res) => {
    global.conn.request().query(`SELECT * FROM Ticket 
    SELECT * FROM ${req.params.table}`)
        .then(result => res.json(result))
        .catch(err => res.json(err));
})

module.exports = app;