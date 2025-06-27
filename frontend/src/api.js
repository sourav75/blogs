// src/api.js
// Utility functions for backend API calls

const API_BASE = 'http://localhost:3000'; // Change if backend runs elsewhere

export async function register(username, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    credentials: 'include'
  });
  return res.json();
}

export async function createBlog(content) {
  const res = await fetch(`${API_BASE}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content })
  });
  return res.json();
}

export async function getBlogById(id) {
  const res = await fetch(`${API_BASE}/blogs/${id}`);
  return res.json();
}

export async function getBlogsByUser(username) {
  const res = await fetch(`${API_BASE}/users/${username}/blogs`);
  return res.json();
}

export async function getAllBlogs(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/blogs?page=${page}&limit=${limit}`);
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return res.json();
}
