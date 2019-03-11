//Requires
var express = require("express");

//Inicializar variables
var app = express();
var fileUpload = require("express-fileupload");
var fs = require("fs");

//modelos
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// default options
app.use(fileUpload());

app.put("/:tipo/:id", (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  //tipos de coleccion
  var tiposValido = ["usuarios", "medicos", "hospitales"];

  if (tiposValido.indexOf(tipo) < 0) {
    res.status(400).json({
      ok: false,
      mensaje: "Tipo de coleccion no es válida",
      errors: { message: "Tipo de coleccion no es válida" }
    });
  }

  if (!req.files) {
    res.status(400).json({
      ok: false,
      mensaje: "No seleccionó nada",
      errors: { message: "Debe seleccionar una imagen" }
    });
  }
  //Obtener nombre del archivo
  var archivo = req.files.img;
  var nombreCorto = archivo.name.split(".");
  var extensionArchivo = nombreCorto[nombreCorto.length - 1];

  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extesión no válida",
      errors: {
        message: "Las extensiones son " + extensionesValidas.join(", ")
      }
    });
  }
  //Nombre de archivo personalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover el archivo",
        errors: { message: "Error al mover el archivo" + err }
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
  });

  /* res.status(200).json({
    ok: true,
    mensaje: "Petición Realizada Correctamente",
    nombreCorto: nombreCorto,
    extension: extensionArchivo
  }); */
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  switch (tipo) {
    case "usuarios":
      Usuario.findById(id, (err, usuario) => {
        if (!usuario) {
          return res.status(400).json({
            ok: false,
            mensaje: "Usuario no existe",
            errors: { message: "Usuario no existe" + err }
          });
        }
        var pathViejo = "./uploads/usuarios/" + usuario.img;

        if (fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        usuario.img = nombreArchivo;
        usuario.save((err, usuarioActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizado",
            usuario: usuarioActualizado
          });
        });
      });
      break;
    case "hospitales":
      Hospital.findById(id, (err, hospital) => {
        if (!hospital) {
          return res.status(400).json({
            ok: false,
            mensaje: "Hospital no existe",
            errors: { message: "Hospital no existe" + err }
          });
        }
        var pathViejo = "./uploads/hospitales/" + hospital.img;

        if (fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        hospital.img = nombreArchivo;
        hospital.save((err, hospitalActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizado",
            hospital: hospitalActualizado
          });
        });
      });
      break;
    case "medicos":
      Medico.findById(id, (err, medico) => {
        if (!medico) {
          return res.status(400).json({
            ok: false,
            mensaje: "Medico no existe",
            errors: { message: "Medico no existe" + err }
          });
        }
        var pathViejo = "./uploads/medicos/" + medico.img;

        if (fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        medico.img = nombreArchivo;
        medico.save((err, medicoActualizado) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen de usuario actualizado",
            medico: medicoActualizado
          });
        });
      });
      break;

    default:
      res.status(400).json({
        ok: true,
        message: "Los tipos de búsqueda solo son usuario, medicos y hospitales",
        error: { message: "Tipo de tabla / colección no válida" }
      });
  }
}

module.exports = app;
