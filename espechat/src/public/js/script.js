const socket = io();

const send = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");
const messageInput = document.querySelector("#message");
const logoutBtn = document.querySelector("#logout-btn");
let typingTimeout;
let isTyping = false;

// Evento para logout
logoutBtn.addEventListener("click", () => {
  // Limpiar cookie
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Redirigir al registro
  window.location.href = "/register";
});

send.addEventListener("click", () => {
  const message = messageInput.value;
  if (message.trim()) {
    socket.emit("message", message);
    messageInput.value = "";
    // Detener indicador de escritura al enviar
    if (isTyping) {
      socket.emit("stopTyping");
      isTyping = false;
    }
  }
});



// Eventos de escritura
messageInput.addEventListener("input", () => {
  // Si no estaba escribiendo, emitir evento de typing
  if (!isTyping) {
    socket.emit("typing");
    isTyping = true;
  }

  // Limpiar timeout anterior
  clearTimeout(typingTimeout);

  // Establecer nuevo timeout para detectar cuando deja de escribir
  typingTimeout = setTimeout(() => {
    socket.emit("stopTyping");
    isTyping = false;
  }, 2000); // 2 segundos sin escribir
});





// Escuchar cuando otros usuarios están escribiendo
socket.on("typing", ({ user }) => {
  const typingIndicator = document.querySelector("#typing-indicator");
  typingIndicator.textContent = `${user} está escribiendo...`;
  typingIndicator.style.display = "block";
});

// Escuchar cuando otros usuarios dejan de escribir
socket.on("stopTyping", ({ user }) => {
  const typingIndicator = document.querySelector("#typing-indicator");
  typingIndicator.textContent = "";
  typingIndicator.style.display = "none";
});






socket.on("message", ({ user, message, date, photoUrl }) => {
  // Verificar si la foto existe, si no usar una predeterminada
  const imageSrc = photoUrl || "/img/paulo.png";
  
  const msg = document.createRange().createContextualFragment(`
    <div class="message">
      <div class="image-container">
        <img src="${imageSrc}" alt="${user}" onerror="this.src='/img/paulo.png'" />
      </div>
      <div class="message-body">
        <div class="user-info">
          <span class="username">${user}</span>
          <span class="time">${date}</span>
        </div>
        <p>
          ${message}
        </p>
      </div>
    </div>
  `);
  allMessages.append(msg);
  
  // Auto-scroll al último mensaje
  allMessages.scrollTop = allMessages.scrollHeight;
});

