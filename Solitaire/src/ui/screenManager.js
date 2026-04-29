let currentScreen = 'menu';

export function showScreen(id) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(`screen-${id}`);
  if (!next || current === next) return;
  if (current) {
    current.classList.add('leaving');
    current.classList.remove('active');
    setTimeout(() => current.classList.remove('leaving'), 350);
  }
  next.classList.add('active');
  currentScreen = id;
}

export function getCurrentScreen() { return currentScreen; }

export function showModal(id) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById(id);
  if (!modal) return;
  overlay.style.display = 'block';
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    modal.classList.add('active');
  });
  modal.querySelector('[autofocus]')?.focus();
}

export function hideModal(id) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    const anyOpen = document.querySelector('.modal.active');
    if (!anyOpen) overlay.style.display = 'none';
  }, 200);
}

export function hideAllModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.classList.remove('active');
    m.style.display = 'none';
  });
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
  }
}

export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}
