const API_BASE_URL = 'https://spice-bite.onrender.com/api';
const TOKEN_KEY = 'spicebite_admin_token';

const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginMessage = document.getElementById('loginMessage');
const logoutButton = document.getElementById('logoutButton');
const refreshButton = document.getElementById('refreshButton');
const bookingTableBody = document.getElementById('bookingTableBody');
const bookingCount = document.getElementById('bookingCount');
const latestUpdate = document.getElementById('latestUpdate');
const dashboardMessage = document.getElementById('dashboardMessage');

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const setMessage = (element, message, type = '') => {
  element.textContent = message;
  element.className = element.className
    .split(' ')
    .filter((className) => !['error', 'success'].includes(className))
    .join(' ');

  if (type) {
    element.classList.add(type);
  }
};

const showDashboard = () => {
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
};

const showLogin = () => {
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
};

const authFetch = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const result = await response.json();

  if (response.status === 401) {
    clearToken();
    showLogin();
    throw new Error(result.message || 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    throw new Error(result.message || 'Request failed.');
  }

  return result;
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const renderBookings = (bookings) => {
  bookingCount.textContent = bookings.length;
  latestUpdate.textContent = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (!bookings.length) {
    bookingTableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings found.</td></tr>';
    return;
  }

  bookingTableBody.innerHTML = bookings.map((booking) => `
    <tr data-id="${booking._id}">
      <td>${escapeHtml(booking.fullName)}</td>
      <td>${escapeHtml(booking.phone)}</td>
      <td>${formatDate(booking.date)}</td>
      <td>${escapeHtml(booking.time)}</td>
      <td>${escapeHtml(booking.guests)}</td>
      <td>${escapeHtml(booking.requests || '-')}</td>
      <td>
        <button class="delete-btn" type="button" data-id="${booking._id}">Delete</button>
      </td>
    </tr>
  `).join('');
};

const loadBookings = async () => {
  try {
    setMessage(dashboardMessage, 'Loading bookings...');

    const result = await authFetch(`${API_BASE_URL}/bookings`);
    renderBookings(result.data || []);

    setMessage(dashboardMessage, 'Bookings loaded successfully.', 'success');
  } catch (error) {
    setMessage(dashboardMessage, error.message, 'error');
  }
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';
    setMessage(loginMessage, '');

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed.');
    }

    setToken(result.token);
    loginForm.reset();
    setMessage(loginMessage, 'Login successful.', 'success');
    showDashboard();
    await loadBookings();
  } catch (error) {
    setMessage(loginMessage, error.message, 'error');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Login';
  }
});

bookingTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('.delete-btn');
  if (!button) return;

  const bookingId = button.dataset.id;
  const row = button.closest('tr');

  if (!window.confirm('Delete this booking?')) {
    return;
  }

  try {
    button.disabled = true;
    button.textContent = 'Deleting...';

    await authFetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    row.remove();
    const currentCount = Math.max(Number(bookingCount.textContent) - 1, 0);
    bookingCount.textContent = currentCount;

    if (!bookingTableBody.querySelector('tr')) {
      bookingTableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings found.</td></tr>';
    }

    setMessage(dashboardMessage, 'Booking deleted successfully.', 'success');
  } catch (error) {
    button.disabled = false;
    button.textContent = 'Delete';
    setMessage(dashboardMessage, error.message, 'error');
  }
});

logoutButton.addEventListener('click', () => {
  clearToken();
  showLogin();
  setMessage(loginMessage, 'You have been logged out.', 'success');
});

refreshButton.addEventListener('click', loadBookings);

if (getToken()) {
  showDashboard();
  loadBookings();
} else {
  showLogin();
}
