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
    client.query('select * from autenticausuarioemail($1, $2) as passed', [email, password], function(err, result){
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
  var email = req.params.email;
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    client.query('select * from autenticausuarioface($1, $2) as passed', [email, id], function(err, result){
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
  var email = req.params.email;
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
  var email = req.params.email;
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

app.get('/rests/:dist/:lat/:lon', function(req, res, next) {
  var distance = req.params.dist;
  var latitude = req.params.lat;
  var longitude = req.params.lon;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * FROM getrestaurantes($1,$2,$3)', [distance, latitude, longitude], function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

app.get('/newrest/:nombre/:lat/:lon/:contact/:horario/:precio', function(req, res, next) {
  var name = req.params.nombre;
  var latitude = req.params.lat;
  var longitude = req.params.lon;
  var contact = req.params.contact;
  var horario = req.params.horario;
  var precio = req.params.precio;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL nuevorestaurante($1,$2,$3,$4,$5,$6)', [name, latitude, longitude, contact, horario, precio],
    function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

app.get('/comment/:user/:rest/:comm', function(req, res, next) {
  var user = req.params.user;
  var rest = req.params.rest;
  var comm = req.params.comm;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL comentario($1,$2,$3)', [user, rest, comm], function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
});

app.get('/califica/:user/:rest/:cal', function(req, res, next) {
  var user = req.params.user;
  var rest = req.params.rest;
  var cal = req.params.cal;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL calificacion($1,$2,$3)', [user, rest, cal], function(err, result) {
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
