const form = document.querySelector("#form");
const usernameInput = document.querySelector("#username");
const photoInput = document.querySelector("#profile-photo");
const photoPreview = document.querySelector(".photo-preview");
const previewImg = document.querySelector("#preview-img");
const previewText = document.querySelector("#preview-text");
const goToChatBtn = document.querySelector("#go-to-chat-btn");
let selectedFile = null;

// Abrir selector de archivos al hacer clic en la vista previa
photoPreview.addEventListener("click", () => {
  photoInput.click();
});

// Vista previa de la foto
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImg.src = event.target.result;
      previewImg.style.display = "block";
      previewText.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Botón "Ir al Chat" - envía la foto y redirecciona
goToChatBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  
  if (!username) {
    alert("Por favor ingresa un nombre de usuario");
    return;
  }

  if (!selectedFile) {
    alert("Por favor selecciona una foto de perfil");
    return;
  }

  try {
    // Crear FormData para enviar la foto
    const formData = new FormData();
    formData.append("username", username);
    formData.append("photo", selectedFile);

    // Enviar foto al servidor
    const response = await fetch("/upload-photo", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Guardar username en cookie
      document.cookie = `username=${username}`;
      // Redirigir al chat
      window.location.href = "/";
    } else {
      alert("Error al subir la foto. Intenta de nuevo.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al registrarse. Intenta de nuevo.");
  }
});

