//Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var autentication = require("../middlewares/autenticacion");

//Inicializar variables
var app = express();
//modelo hospital
var Hospital = require("../models/hospital");

// =========================================================
// 'Consultar Hospitales'
// =========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Get de Hospitales",
          errors: err
        });
      }

      Hospital.count({}, (err, conteo) => {
        return res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: conteo
        });
      });
    });
});
// =========================================================
// 'Actualizar Hospitales'
// =========================================================

app.put("/:id_hospital", autentication.verificaToken, (req, res, next) => {
  var id = req.params.id_hospital;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el hospital",
        errors: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: " No existe un hospital con el id: " + id }
      });
    }
    hospital.nombre = body.nombre;
    // hospital.img = body.img;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el hospital",
          errors: err
        });
      }
      return res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

// =========================================================
// 'Agregar Nuevo hospital'
// =========================================================
app.post("/", autentication.verificaToken, (req, res, next) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    //  img: body.img,
    usuario: req.usuario._id
  });
  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el hospi tal",
        errors: err
      });
    }
    return res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

// =========================================================
// 'Eliminar usuarios'
// =========================================================

app.delete("/:id_hospital", autentication.verificaToken, (req, res, next) => {
  var id = req.params.id_hospital;
  Hospital.findByIdAndRemove(id, (err, hospitalDelete) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar el usaurio",
        errors: err
      });
    }

    if (!hospitalDelete) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe ningun hospital con el id " + id,
        errors: { mensaje: "No existe ningun usuario con el id " + id }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalDelete
    });
  });
});
module.exports = app;
