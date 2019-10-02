var express = require("express");
var pg = require("pg");
var app = express();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'willyelpez@gmail.com',
    pass: 'megustaelagua'
  }
});

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
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
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
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
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
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
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
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
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
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
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
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        var obj = result.rows;
        obj.forEach((item, index)=> {
          if (item.calificacion == null) {
            item.calificacion = 0;
          }
        });
        res.status(200).send(obj);
      }
    });
  });
});

app.get('/newrest/:nombre/:lat/:lon/:contact/:horario/:precio/:tipo', function(req, res, next) {
  var name = req.params.nombre;
  var latitude = req.params.lat;
  var longitude = req.params.lon;
  var contact = req.params.contact;
  var horario = req.params.horario;
  var precio = req.params.precio;
  var tipo = req.params.tipo;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL nuevorestaurante($1,$2,$3,$4,$5,$6,$7)', [name, latitude, longitude, contact, horario, precio, tipo],
    function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/modifyrest/:id/:nombre/:lat/:lon/:contact/:horario/:precio/:tipo', function(req, res, next) {
  var idrest = req.params.id;
  var name = req.params.nombre;
  var latitude = req.params.lat;
  var longitude = req.params.lon;
  var contact = req.params.contact;
  var horario = req.params.horario;
  var precio = req.params.precio;
  var tipo = req.params.tipo;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL updaterestaurante($1,$2,$3,$4,$5,$6,$7,$8)', [idrest, name, latitude, longitude, contact, horario, precio, tipo],
    function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/comment/:rest/:user/:comm', function(req, res, next) {
  var user = req.params.user;
  var rest = req.params.rest;
  var comm = req.params.comm;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL comentario($1,$2,$3)', [rest, user, comm], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/comments/:rest/', function(req, res, next) {
  var user = req.params.user;
  var rest = req.params.rest;
  var comm = req.params.comm;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * from getcomments($1)', [rest], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/califica/:rest/:user/:cal', function(req, res, next) {
  var user = req.params.user;
  var rest = req.params.rest;
  var cal = req.params.cal;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL calificacion($1,$2,$3)', [rest, user, cal], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/userid/:correo', function(req, res, next) {
  var correo = req.params.correo;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * FROM getuserid($1)', [correo], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/admin/usuarios', function(req, res, next) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * FROM getusuarios()', [], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/rest/:id', function(req, res, next) {
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('SELECT * FROM getRestaurante($1)', [id], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = [{"error":"some error"}]
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send(result.rows);
      }
    });
  });
});

app.get('/deleterest/:rest', (req, res, next) => {
  var rest = req.params.rest;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL deleterest($1)', [rest], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = {"borrado":false}
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send({"borrado":true});
      }
    });
  });
});

app.get('/recupera/:mail', (req, res, next) => {
  var mail = req.params.mail;
  var msg = 'Para cambiar su contrasena ingrese en el siguiente link www.proyectofredoyandy.online/recover/'+mail;
  var mailOptions = {
    from: 'willyelpez@gmail.com',
    to: mail,
    subject: 'Recuperar contrasena',
    text: msg
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(err);
      var error = {"enviado":false}
      res.status(200).send(error);
    } else {
      res.status(200).send({"enviado":true});
    }
  });
});

app.get('/cambia/:passwd/:mail', (req, res, next) => {
  var pass = req.params.passwd;
  var mail = req.params.mail;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("not able to connect" + err);
      res.status(400).send(err);
    }
    client.query('CALL cambiapassword($1,$2)', [pass, mail], function(err, result) {
      done();
      if (err) {
        console.log(err);
        var error = {"borrado":false}
        res.status(200).send(error);
      }
      if (result!=null) {
        res.status(200).send({"borrado":true});
      }
    });
  });
});

var server = app.listen(PORT, function () {
    console.log("app running on port.", server.address().port);
});
