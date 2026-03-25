import axios from "axios";
import { getToken } from "./auth";

// Base URL for backend API
// const API_BASE = "https://chat-assistant-bot-uiue.onrender.com";
  const API_BASE = "http://127.0.0.1:8000";

// Axios instance with Authorization header
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- Session APIs -----------------

// Create new session
export async function createSession(title = "New Chat") {
  const res = await api.post("/session/create", { title });

  // Normalize backend response to match frontend session shape
  return {
    id: res.data.session_id,
    title: res.data.title,
    created_at: res.data.created_at
  };
}

// List all sessions for current user
export async function getSessions() {
  const res = await api.get("/session/list");
  return res.data;
}

// Delete a session
export async function deleteSession(sessionId) {
  const res = await api.delete(`/session/delete/${sessionId}`);
  return res.data;
}

// Rename a session
export async function renameSession(sessionId, title) {
  const res = await api.put(`/session/rename/${sessionId}`, { title });
  return res.data;
}

// ----------------- Message APIs -----------------

// Send a message
export async function sendMessage(data) {
  const res = await api.post("/message/send", data);
  return res.data;
}

// Get message history of a session
export async function getMessages(sessionId) {
  const res = await api.get(`/message/history/${sessionId}`);
  return res.data;
}

// samrt session title update based on first user message
export async function generateSmartTitle(message) {
  const res = await api.post("/session/generate-title", { message });
  return res.data.title;
}