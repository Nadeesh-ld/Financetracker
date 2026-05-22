// Global auth functions (no ES modules)
const API_BASE = window.API_USER_BASE || 'http://localhost:3001/users';

async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server error: ${text.substring(0, 100)}`);
    }
    if (!res.ok) throw data || { message: 'Login failed' };
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

async function register(name, email, password) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server error: ${text.substring(0, 100)}`);
    }
    if (!res.ok) throw data || { message: 'Registration failed' };
    return data;
  } catch (err) {
    console.error('Register error:', err);
    throw err;
  }
}

function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
