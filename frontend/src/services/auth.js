//Includes saving, retrieving, and removing user info and auth token.

// Save the user information to localStorage
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Get the user information from localStorage
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Save the authentication token to localStorage
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// Get the authentication token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Remove user data and token from localStorage (logout)
export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}