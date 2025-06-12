const socket = io();

let name;
const textarea = document.querySelector("#textarea");
const chatBox = document.querySelector(".chat-box");

do {
  name = prompt("Please inter your name: ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let sms = {
    user: name,
    message: message.trim(),
  };

  appendMessage(sms, "outgoing");
  textarea.value = "";
  scrollToBottom();

  socket.emit("message", sms);
}

function appendMessage(sms, type) {
  let mainDiv = document.createElement("div");
  let className = type;

  mainDiv.classList.add(className, "message");

  let markup = `

    <h4>${sms.user}</h4>
    <p>${sms.message}</p>
      
    `;
  mainDiv.innerHTML = markup;

  chatBox.appendChild(mainDiv);
}

// recieve message

socket.on("message", (sms) => {
  appendMessage(sms, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}
