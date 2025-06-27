// src/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Change if backend runs elsewhere
export const socket = io(SOCKET_URL, { withCredentials: true });
