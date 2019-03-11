//Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var autentication = require("../middlewares/autenticacion");

//Inicializar variables
var app = express();
//modelo hospital
var Medico = require("../models/medico");

// =========================================================
// 'Consultar Medicos'
// =========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Get de Medicos",
          errors: err
        });
      }

      Medico.count({}, (err, conteo) => {
        return res.status(200).json({
          ok: true,
          medicos: medicos,
          total: conteo
        });
      });
    });
});
// =========================================================
// 'Actualizar Medico'
// =========================================================

app.put("/:id", autentication.verificaToken, (req, res, next) => {
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el medico",
        errors: err
      });
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El medico con el id " + id + " no existe",
        errors: { message: " No existe un medico con el id: " + id }
      });
    }

    medico.nombre = body.nombre;
    // medico.img = body.img;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el medico",
          errors: err
        });
      }
      return res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

// =========================================================
// 'Agregar Nuevo Medico'
// =========================================================
app.post("/", autentication.verificaToken, (req, res, next) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });
  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el médico",
        errors: err
      });
    }
    return res.status(201).json({
      ok: true,
      medico: medicoGuardado
    });
  });
});

// =========================================================
// 'Eliminar Medico'
// =========================================================

app.delete("/:id", autentication.verificaToken, (req, res, next) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoDelete) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar el medico",
        errors: err
      });
    }

    if (!medicoDelete) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe ningun medico con el id " + id,
        errors: { mensaje: "No existe ningun medico con el id " + id }
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoDelete
    });
  });
});

module.exports = app;
