var express = require("express");
var pg = require("pg");
var app = express();

var config = {
  host:'ec2-184-73-169-163.compute-1.amazonaws.com',
  user:'uyjxrwtnjpkphb',
  password:'91922efb0954a45b457ca8a0ad1f50d9a8030a22e965891877c4f54cb8e0c47a',
  database:'d5p2ul5ueis3kv',
  port:5432,
  ssl:true
}
const PORT = process.env.PORT || 5000

var pool = pg.Pool(config);

app.get('/', function(req, res, next) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * FROM restaurante', function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

var server = app.listen(PORT, function () {
    console.log("app running on port.", server.address().port);
});
