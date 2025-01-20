// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000"; // Replace with backend URL
const socket = io(SOCKET_URL);

export default socket;
