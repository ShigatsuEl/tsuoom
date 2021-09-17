const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#nickname input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  const messageForm = room.querySelector("#message");
  const nicknameForm = room.querySelector("#nickname");
  h3.innerText = `Room ${roomName}`;
  messageForm.addEventListener("submit", handleMessageSubmit);
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("enter_room", (user) => {
  addMessage(`${user} joined`);
});

socket.on("leave_room", (user) => {
  addMessage(`${user} left`);
});

socket.on("new_message", addMessage);
