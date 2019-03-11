//Requires
var express = require('express');
var mongoose = require ('mongoose');
var bodyParser = require('body-parser')

//Inicializar variables
var app = express();


//Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Server index
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads',serveIndex(__dirname +'/uploads'));
//Importar rutas

var appRoutes = require('./routes/app.js');
var usuarioRoutes = require('./routes/usuario.js');
var loginRoutes = require('./routes/login.js');
var hospitalRoutes = require('./routes/hospital.js');
var medicoRoutes = require('./routes/medico.js');
var busquedaRoutes = require('./routes/busqueda.js');
var uploadRoutes = require('./routes/upload.js');
var imagenesRoutes = require('./routes/imagenes.js');

//Conexion a la base de datos 
var uri = 'mongodb://angular:q1w2e3r4@18.236.154.49:27017/hospitalDB?authMechanism=SCRAM-SHA-1';
var options = {
     autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };

mongoose.connect( uri , options ,(err ,res )=>{
    
    if ( err) throw err;
    console.log('Base de datos Online:  \x1b[32m%s\x1b[0m', 'online');
  }
);
  
//Rutas

app.use('/login',loginRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/busqueda',busquedaRoutes); 
app.use('/medico',medicoRoutes);
app.use('/upload',uploadRoutes);
app.use('/imagenes',imagenesRoutes);

app.use('/',appRoutes);


//Escuchar peticiones
app.listen(3000 , ()=>{
    console.log('Express Server Puerto 3000:  \x1b[32m%s\x1b[0m', 'online');
});