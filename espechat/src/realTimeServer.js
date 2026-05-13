module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const path = require("path");
  const fs = require("fs");
  const io = new Server(httpServer);
  
  io.on("connection", (socket) => {
    socket.on("message", (message) => {
      const cookie = socket.request.headers.cookie;
      const user = cookie.split("=").pop();

      // Leer extensión del archivo JSON
      const userPhotosPath = path.join(__dirname, "public", "userPhotos.json");
      let photoUrl = "/img/paulo.png"; // fallback
      
      if (fs.existsSync(userPhotosPath)) {
        const userPhotos = JSON.parse(fs.readFileSync(userPhotosPath, "utf8"));
        if (userPhotos[user]) {
          photoUrl = `/uploads/${user}${userPhotos[user]}`;
        }
      }

      io.emit("message", {
        user,
        message,
        date: new Date().toLocaleTimeString(),
        photoUrl,
      });
    });

    // Evento para cuando el usuario comienza a escribir
    socket.on("typing", () => {
      const cookie = socket.request.headers.cookie;
      const user = cookie.split("=").pop();
      
      // Enviar a todos EXCEPTO al que está escribiendo
      socket.broadcast.emit("typing", { user });
    });

    // Evento para cuando el usuario deja de escribir
    socket.on("stopTyping", () => {
      const cookie = socket.request.headers.cookie;
      const user = cookie.split("=").pop();
      
      // Enviar a todos EXCEPTO al que dejó de escribir
      socket.broadcast.emit("stopTyping", { user });
    });
  });
};
