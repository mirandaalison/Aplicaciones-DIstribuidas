
//ESTE ES EL INDEX.JS

// creo express
const express = require('express');
//ahora necito crear un srvidor que reciba peticiones http sin cecirle la version, djeo por defalt
const {createServer} = require('http');
const realTimeServer = require("./realTimeServer"); //importo el servidor de tiempo real, lo que hace es exportar la conexion hacia el servidor
//tengo la ruta donde va a estar la sincronizacion de lso archivos
const path = require('path');

//neceito un lugar donde hacer las pteciones
const app = express();
//esa app debe tener los permisos para hacer las peticiones http
const httpServer = createServer(app);

//configurar la app para a traves de un puerto comectrame a la app, le asigno un puerto, en este caso el 3000
app.set("port", process.env.PORT || 3000);
//voy a decirle donde estan las rutas desde el path, en donde estan los directorios a los que voy a conectar la app
app.set("views", path.join(__dirname, "views")); //se crea la ruta para las vistas directamente

//le digo que use las rutas que estan en el index.js
app.use(require("./routes/socket")); 

//ahora quiero definir rutas publicas par apoder acceder, rutas privadas a recursos especificos
app.use(express.static(path.join(__dirname, "public")));

//hago petiicioon para obtener la aplicacion
httpServer.listen(app.get("port"), () => { //funcion closure pq tiene esto () =>
    console.log("La aplicación está corriendo en el puerto ", app.get("port"));
})

//voy  ainiciar en tiempo real
realTimeServer(httpServer);

