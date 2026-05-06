//aqui voy a navegar entre todas las rutas
//un slo archivo que ocnfigure el sistema total de ruteo
const express = require('express');
//le digo quiero usar a express, y como ya tengo hago l a instancia para acceder
const router = express.Router();
//directorio especifico de las rutas centralizado
const path = require('path');

const views = path.join(__dirname, "/../views");

//ahora configuro el sistema de rutas
router.get("/", (req, res) => {
    res.sendFile(views + "/socket.html"); //le digo que me envie el index.html, y lo busque en la ruta de las vistas
});

module.exports = router; //exporto el router para que pueda ser usado en el socket.js