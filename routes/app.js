//Requires
var express = require('express');
 
//Inicializar variables
var app = express();

//Rutas

app.get('/',(req, res, next)=>{
    res.status(400).json({
        ok:true,
        mensaje: 'Petición Realizada Correctamente'
    });
})

module.exports = app;