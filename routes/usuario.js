//Requires
var express = require("express");
var bcrypt = require("bcryptjs");
/* var jwt = require('jsonwebtoken'); */
var autentication = require("../middlewares/autenticacion");

//Inicializar variables
var app = express();

// modelo del Usuario
var Usuario = require("../models/usuario");
/* var SEED = require ('../config/config').SEED; */
//Rutas

// =========================================================
// 'Obtener todos los usuarios'
// =========================================================
app.get("/", autentication.verificaToken,  (req, res, next) => {
  Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Get de Usuarios",
        errors: err
      });
    }
    return res.status(200).json({
      ok: true,
      usuarios: usuarios
    });
  });
});

// =========================================================
// 'Actualizar usuario'
// =========================================================

app.put("/:id", autentication.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
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
        mensaje: "El usuario con el id " + id + " no existe",
        errors: { message: " No existe un usuario con el id: " + id }
      });
    }
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = usuario.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err
        });
      }
      return res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioToken : req.usuario

      });
    });
  });
});

// =========================================================
// 'Crear un nuevo usuario'
// =========================================================

app.post("/", autentication.verificaToken, (req, res, next) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, userSave) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el usuario",
        errors: err
      });
    }
    return res.status(201).json({
      ok: true,
      body: userSave
    });
  });
});

// =========================================================
// 'Eliminación de usuarios'
// =========================================================

app.delete("/:id_user", autentication.verificaToken,  (req, res) => {
  var id = req.params.id_user;
  Usuario.findByIdAndRemove(id, (err, userDelete) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar el usaurio",
        errors: err
      });
    }

    if (!userDelete) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe ningun usuario con el id " + id,
        errors: { mensaje: "No existe ningun usuario con el id " + id }
      });
    }

    res.status(200).json({
      ok: true,
      usuario: userDelete
    });
  });
});

module.exports = app;
