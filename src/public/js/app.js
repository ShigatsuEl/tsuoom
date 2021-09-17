/**
 * Chat Part
 */
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

function showRoomName(roomName, count) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const messageForm = room.querySelector("form");
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

socket.on("enter_room", (user, count) => {
  if (count) {
    showRoomName(roomName, count);
  } else {
    addMessage(`${user} joined`);
  }
});

socket.on("leave_room", (user, count) => {
  if (count) {
    showRoomName(roomName, count);
  } else {
    addMessage(`${user} left`);
  }
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.lenght === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});

/**
 * Video Part
 */
const myCamera = document.getElementById("myCamera");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("cameraBtn");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myCamera.srcObject = myStream;
    await getCameras();
  } catch (e) {
    console.log(e);
  }
}

getMedia();

function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
