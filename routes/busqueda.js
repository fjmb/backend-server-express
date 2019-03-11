//Requires
var express = require("express");

//Inicializar variables
var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  var tabla = req.params.tabla;
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  var promesa;
  switch (tabla) {
    case "hospitales":
      promesa = buscarHospitales(busqueda, regex);
      break;
    case "medicos":
      promesa = buscarMedicos(busqueda, regex);
      break;
    case "usuarios":
      promesa = buscarUsuarios(busqueda, regex);
      break;
    default:
      res.status(400).json({
        ok: true,
        message: "Los tipos de búsqueda solo son usuario, medicos y hospitales",
        error: { message: "Tipo de tabla / colección no válida" }
      });
  }

  promesa.then(respuestas => {
    res.status(400).json({
      ok: true,
      [tabla]: respuestas
    });
  });
});

app.get("/todo/:busqueda", (req, res, next) => {
  var coleccion = req.params.busqueda;
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex)
  ]).then(respuestas => {
    res.status(400).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1]
    });
  });

  /* buscarHospitales( busqueda,regex).then( hospitales =>{

    res.status(400).json({
        ok: true,
        hospitales: hospitales
      });
}); */
  /* Hospital.find({ nombre: regex }).exec((err, hospitales) => {
    console.log(hospitales);

    res.status(400).json({
      ok: true,
      hospitales: hospitales
    });
  }); */
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex }).exec((err, hospitales) => {
      if (err) {
        reject("Error al cargar hospitales", err);
      } else {
        resolve(hospitales);
      }
    });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex }).exec((err, medicos) => {
      if (err) {
        reject("Error al cargar medicos", err);
      } else {
        resolve(medicos);
      }
    });
  });
}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({ nombre: regex }).exec((err, usuarios) => {
      if (err) {
        reject("Error al cargar usuarios", err);
      } else {
        resolve(usuarios);
      }
    });
  });
}

module.exports = app;
