// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://23.22.184.219:4000"; // Replace with backend URL
const socket = io(SOCKET_URL);

export default socket;
