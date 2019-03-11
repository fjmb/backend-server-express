//Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//Inicializar variables
var app = express();

// modelo del Usuario
var Usuario = require("../models/usuario");
var SEED = require("../config/config").SEED;

//Config Google
var CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

// =========================================================
// 'Autenticacion de Google'
// =========================================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //const userid = payload["sub"];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
    // payload: payload
  };
}

// =========================================================
// 'Login con google'
// =========================================================
app.post("/google", async (req, res) => {
  var tokenId = req.body.idToken;

  var googleUser = await verify(tokenId).catch(e => {
    return res.status(403).json({
      ok: false,
      mensaje: "Token no válido"
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el usuario",
        errors: err
      });
    }
    if (usuario) {
      if (usuario.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe usar su autenticacion normal",
          errors: err
        });
      } else {
        //Crear token
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
          ok: true,
          usuario: usuario,
          token: token,
          id: usuario._id
        });
      }
    } else {
      //El usuario no existe, hay que crearlo
      var usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioGuardado) => {
        //Crear token
        var token = jwt.sign({ usuario: usuarioGuardado }, SEED, {
          expiresIn: 14400
        }); // 4 horas

        res.status(200).json({
          ok: true,
          usuario: usuarioGuardado,
          token: token,
          id: usuarioGuardado._id
        });
      });
    }
  });
});

// =========================================================
// 'Login Basico'
// =========================================================

app.post("/", (req, res) => {
  var body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el usuario",
        errors: err
      });
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "No se encontro el usuario con el correo" + body.email,
        errors: err
      });
    }
    if (bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales Incorrectas",
        errors: err
      });
    }
    //Crear token
    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    usuario.password = "=)";

    res.status(200).json({
      ok: true,
      usuario: usuario,
      token: token,
      id: usuario._id
    });
  });
});

module.exports = app;
