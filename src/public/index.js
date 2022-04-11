let clientSocket = io();

clientSocket.on("userConnect", (usuario) => {
  if (usuario.id !== clientSocket.id) {
    Swal.fire({
      icon: "info",
      title: usuario.user + " se conectó",
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false,
    });
  }
});

const messageLog = document.getElementById("log");

clientSocket.on("log", (messages) => {
  messageLog.innerHTML = "";
  messages.forEach((msg) => {
    let currentMessage = document.createElement("li");
    let currentUser = document.createElement("span");
    currentUser.innerHTML = msg.user + " dice: ";
    let currentText = document.createElement("span");
    currentText.innerHTML = msg.message;
    currentMessage.appendChild(currentUser).appendChild(currentText);
    messageLog.appendChild(currentMessage);
  });
});

Swal.fire({
  title: "Ingresa tu nombre para el chat",
  input: "text",
  allowOutsideClick: false,
  inputValidator: (value) => {
    return !value && "Necesitas ingresar un nombre si o si";
  },
}).then((result) => {
  clientSocket.emit("userConnect", { name: result.value });
  sessionStorage.chatName = result.value;
});

let chatInput = document.getElementById("chatInput");

chatInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatInput.value.length > 0) {
      clientSocket.emit("message", {
        user: sessionStorage.chatName,
        message: event.target.value.trim(),
      });
      chatInput.value = "";
    }
  }
});
