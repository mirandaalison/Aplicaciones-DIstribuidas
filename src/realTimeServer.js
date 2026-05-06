module.exports = httpServer => {
    //aqui dentro exporto conexion hacia el servidor
    //configuro si quiero que sean unidoreccional o bi
    const{Server} = require("socket.io");
    const io = new Server(httpServer); //le mando al contructor de la clase Server
    io.on("connection", socket => {
        //le voy a pasar cada conexión, cada socket que se habilite
        //muestro en la terminarl el socet de cada usuario que se agrega, como un chat de wpp
        console.log(socket.id);
    })

}