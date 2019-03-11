//Requires
var express = require('express');
 
//Inicializar variables
var app = express();

const path = require('path');
var fs = require("fs");

//Rutas

app.get('/:tipo/:img',(req, res, next)=>{
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve (__dirname, `../uploads/${tipo}/${img}`);
    console.log(pathImagen);
    
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
      }else{
          var pathNoImg = path.resolve(__dirname, `../assets/no-img.jpg`);
          res.sendFile(pathNoImg);

      }

   /*  res.status(400).json({
        ok:true,
        mensaje: 'Petición Realizada Correctamente'
    }); */
})

module.exports = app;