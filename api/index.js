'use strict'

var mongoose = require('mongoose');
var app = require('./app');  
var port = 3800;

// Conexion Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social', { useMongoClient: true})
      .then(() =>{
      	 console.log ("la conexion a la base de datos cusrso_mean_social se ha realizado con correctamente")
         
        // Crear servidor
        app.listen(port, () => {
        	console.log(" Servidor corriendo en http://localhost:3800");
        });

      })
      .catch(err => console.log(err));