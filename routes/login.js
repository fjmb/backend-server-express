//Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//Inicializar variables
var app = express();

// modelo del Usuario
var Usuario = require ('../models/usuario');
var SEED = require ('../config/config').SEED;

app.post('/',(req, res)=>{

    var body = req.body;    
    Usuario.findOne({email : body.email},(err, usuario)=>{
        
        if(err){
            res.status(500).json({
                ok: false,
                mensaje : 'Error al buscar el usuario',
                errors : err
            })
        }
        if(!usuario){
            res.status(400).json({
                ok: false,
                mensaje : 'No se encontro el usuario con el correo' + body.email,
                errors : err
            })
        }
        if (bcrypt.compareSync (body.password, usuario.password )){
            res.status(400).json({
                ok: false,
                mensaje : 'Credenciales Incorrectas',
                errors : err
            })
        }
        //Crear token
        var token = jwt.sign({ usuario: usuario }, SEED, {expiresIn : 14400}); // 4 horas

        usuario.password = '=)'

        res.status(200).json({
            ok: true,
            usuario: usuario,
            token: token,
            id : usuario.id
        })
    })


  

})

module.exports = app;