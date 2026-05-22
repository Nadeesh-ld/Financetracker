// Inject topbar HTML into pages
(() => {
  const currentPage = window.location.pathname;
  const isIndexPage = currentPage === '/' || currentPage.endsWith('index.html');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  let authActionsHtml = '';

  if (isIndexPage) {
    // Show Login and Register only on index.html
    authActionsHtml = `
      <div class="auth-actions">
        <a class="btn btn-outline" href="/src/pages/login.html">Login</a>
        <a class="btn btn-primary" href="/src/pages/register.html">Register</a>
      </div>
    `;
  } else if (user && user.email) {
    // Show user email and logout on other pages
    authActionsHtml = `
      <div class="auth-actions" style="display:flex;align-items:center;gap:15px">
        <span style="color:var(--text-muted);font-size:0.9rem">${user.email}</span>
        <button class="btn btn-outline" onclick="logout()" style="cursor:pointer">Logout</button>
      </div>
    `;
  } else {
    // If not logged in on other pages, redirect to login
    authActionsHtml = `
      <div class="auth-actions">
        <a class="btn btn-outline" href="/src/pages/login.html">Login</a>
        <a class="btn btn-primary" href="/src/pages/register.html">Register</a>
      </div>
    `;
  }

  const html = `
    <header class="top-bar">
      <div class="container">
        <div style="display:flex;align-items:center;gap:18px">
          <h1 class="brand">💰 Finance Tracker</h1>
          <nav class="main-nav">
            <a href="/src/pages/index.html">Home</a>
            <a href="/src/pages/dashboard.html">Dashboard</a>
            <a href="/src/pages/live-rates.html">Live Rates</a>
            <a href="/src/pages/reports.html">Reports</a>
            <a href="/src/pages/settings.html">Settings</a>
          </nav>
        </div>
        ${authActionsHtml}
      </div>
    </header>
  `;

  const container = document.getElementById('topbar');
  if (container) container.innerHTML = html;
})();

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/src/pages/index.html';
}
