//Requires
var express = require('express');
var mongoose = require ('mongoose');

//Inicializar variables
var app = express();

//Conexion a la base de datos //#endregion

mongoose.connection.openUri('mongodb://18.236.154.49:27017/hospitalDB', (err ,res )=>{
    if ( err) throw err;
    console.log('Base de datos Online:  \x1b[32m%s\x1b[0m', 'online');

})

//Rutas

app.get('/',(req, res, next)=>{
    res.status(400).json({
        ok:true,
        mensaje: 'Petición Realizada Correctamente'
    });
})


//Escuchar peticiones
app.listen(3000 , ()=>{
    console.log('Express Server Puerto 3000:  \x1b[32m%s\x1b[0m', 'online');
});