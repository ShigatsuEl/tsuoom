const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const welcomeForm = welcome.querySelector("#welcome form");

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
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  const messageForm = room.querySelector("form");
  h3.innerText = `Room ${roomName}`;
  messageForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const nicknameInput = welcomeForm.querySelector("#nickname");
  const roomNameInput = welcomeForm.querySelector("#roomName");
  if (nicknameInput.value === "" || roomNameInput.value === "") {
    alert("사용자 이름 또는 방 이름은 필수로 입력해야 합니다");
    return;
  }
  socket.emit("nickname", nicknameInput.value);
  socket.emit("enter_room", roomNameInput.value, showRoom);
  roomName = roomNameInput.value;
  nicknameInput.value = "";
  roomNameInput.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("enter_room", (user) => {
  addMessage(`${user} joined`);
});

socket.on("leave_room", (user) => {
  addMessage(`${user} left`);
});

socket.on("new_message", addMessage);
