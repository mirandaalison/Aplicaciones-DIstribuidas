const express = require("express");
const { createServer } = require("http");
const realTimeServer = require("./realTimeServer");
const path = require("path");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();
const httpServer = createServer(app);

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

// Configurar multer para guardar fotos
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Guardar con el nombre de usuario como nombre de archivo
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.username}${ext}`);
  },
});

const upload = multer({ storage });

// Endpoint para subir foto
app.post("/upload-photo", upload.single("photo"), (req, res) => {
  if (req.file) {
    // Guardar la extensión del archivo en un JSON
    const ext = path.extname(req.file.filename);
    const userPhotosPath = path.join(__dirname, "public", "userPhotos.json");
    
    let userPhotos = {};
    if (fs.existsSync(userPhotosPath)) {
      userPhotos = JSON.parse(fs.readFileSync(userPhotosPath, "utf8"));
    }
    
    userPhotos[req.body.username] = ext;
    fs.writeFileSync(userPhotosPath, JSON.stringify(userPhotos, null, 2));
    
    res.json({ success: true, message: "Foto subida correctamente" });
  } else {
    res.status(400).json({ success: false, message: "Error al subir la foto" });
  }
});

app.use(require("./routes"));

app.use(express.static(path.join(__dirname, "public")));

httpServer.listen(app.get("port"), () => {
  console.log("La aplicación esta corriendo en el puerto ", app.get("port"));
});

realTimeServer(httpServer);
