/* ════════════════════════════════════════════
   STATE & DATA
═════════════════════════════════════════════ */
const TAG_CLASS = {
  'Clásico': 'tag tag-classic',
  'Con canela': 'tag tag-cinnamon'
};

let state = {
  cart: {},
  menuItems: [
    { id: '1', emoji: '☕', name: 'Waaj Chuk Original (250gr)', desc: 'Auténtico molido de tortilla de maíz nixtamalizado y tatemado. Sin cafeína, 100% digestivo y natural.', price: '$140', tag: 'Clásico', photo: 'Imagenes/Original.jpeg' },
    { id: '2', emoji: '🤎', name: 'Waaj Chuk Canela (250gr)', desc: 'Nuestro molido tradicional de maíz tatemado con un toque aromático de canela premium.', price: '$150', tag: 'Con canela', photo: 'Imagenes/Canela.jpeg' }
  ],
  content: {
    waNumber: '5219992679073'
  }
};

/* ════════════════════════════════════════════
   VIEW / SCROLL
═════════════════════════════════════════════ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  closeMobileMenu();
}
function toggleMobileMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
}

/* ════════════════════════════════════════════
   RENDER GRID MENÚ
═════════════════════════════════════════════ */
function renderMenuGrid() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  grid.innerHTML = state.menuItems.map(item => `
    <div class="menu-card">
      ${item.photo ? `<div class="menu-card-img"><img src="${item.photo}" alt="${item.name}" loading="lazy"></div>` : ''}
      <div class="menu-card-body">
        <div class="menu-card-top">
          <span class="${TAG_CLASS[item.tag] || 'tag'}">${item.tag}</span>
        </div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="menu-card-footer">
          <span class="menu-price">${item.price}</span>
          <button class="btn-pedir" onclick="scrollToSection('contacto'); updateCart('${item.id}', 1)">Añadir al pedido</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ════════════════════════════════════════════
   CARRITO / INTERFAZ DE PEDIDO
═════════════════════════════════════════════ */
function renderProductList() {
  const list = document.getElementById('product-list');
  if (!list) return;

  let html = state.menuItems.map(item => {
    const qty = state.cart[item.id] || 0;
    const isActive = qty > 0;
    return `
      <div class="cart-item ${isActive ? 'active' : ''}">
        <div class="cart-item-info">
          <span class="cart-item-title">${item.emoji} ${item.name}</span>
          <span class="cart-item-price">${item.price}</span>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="cart-btn" onclick="updateCart('${item.id}', -1)">−</button>
          <span class="cart-qty">${qty}</span>
          <button type="button" class="cart-btn" onclick="updateCart('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = html;

  const totalItems = Object.values(state.cart).reduce((a, b) => a + b, 0);
  document.getElementById('notes-section').style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateCart(id, delta) {
  if (!state.cart[id]) state.cart[id] = 0;
  state.cart[id] += delta;

  if (state.cart[id] < 0) state.cart[id] = 0;

  document.getElementById('order-error').style.display = 'none';
  renderProductList();
}

function sendWhatsApp() {
  const nombre = document.getElementById('order-nombre').value.trim();
  const tel = document.getElementById('order-tel').value.trim();
  const notes = document.getElementById('order-notes').value.trim();
  const errEl = document.getElementById('order-error');

  if (!nombre) { showError(errEl, 'Por favor, compártenos tu nombre.'); return; }

  const totalItems = Object.values(state.cart).reduce((a, b) => a + b, 0);
  if (totalItems === 0) { showError(errEl, 'Por favor, añade al menos un producto al pedido.'); return; }

  errEl.style.display = 'none';

  let msg = `¡Hola Waaj Chuk! 💗\n\nMe llamo *${nombre}*`;
  if (tel) msg += ` (Tel: ${tel})`;
  msg += `.\n\nLes comparto mi pedido:\n\n`;

  state.menuItems.forEach(item => {
    if (state.cart[item.id] > 0) {
      msg += `☕ *${state.cart[item.id]}x* ${item.name} (${item.price} c/u)\n`;
    }
  });

  if (notes) msg += `\n*Detalles / Notas:*\n"${notes}"\n`;
  msg += '\n¡Quedo a la espera para coordinar la entrega, gracias!';

  window.open(`https://wa.me/${state.content.waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  renderMenuGrid();
  renderProductList();
});
