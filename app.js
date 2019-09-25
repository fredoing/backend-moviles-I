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

app.get('/', function(req, res) {
  res.status(200).send("connected to database");
});

//autentica un usuario administrador
app.get('/admin/:user/:password', function(req, res, next) {
  var user = req.params.user;
  var password = req.params.password;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    client.query('select * from autenticaadmin($1, $2)', [user, password], function(err, result){
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

//autentica un usuario normal
app.get('/user/:email/:password', function(req, res, next) {
  var email = req.params.email;
  var password = req.params.password;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    client.query('select * from autenticausuarioemail($1, $2)', [email, password], function(err, result){
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

//autentica un usuario de facebook
app.get('/facebookuser/:email/:id', function(req, res, next) {
  var user = req.params.user;
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    client.query('select * from autenticausuarioface($1, $2)', [email, id], function(err, result){
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

//add a new simple user name, email, password are required
app.get('/newUser/:nom/:email/:password', function(req, res, next) {
  var nombre = req.params.nom;
  var email = req.param.email;
  var password = req.params.password;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    client.query('call nuevousuarioemail($1,$2,$3);', [nombre, email, password], function(err, result){
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

//add new facebook user name, email and facebook id are required
app.get('/newFaceUser/:nom/:email/:id', function(req, res, next) {
  var nombre = req.params.nom;
  var email = req.param.email;
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    client.query('call nuevousuarioface($1,$2,$3);', [nombre, email, id], function(err, result){
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

app.get('/rests', function(req, res, next) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * FROM getrestaurantes()', function(err, result) {
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