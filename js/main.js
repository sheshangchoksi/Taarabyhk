/* TaaraByHK — shared chrome: header, footer, mobile drawer, toast, thread motif */

const SITE = {
  brand: "Taara",
  brandSuffix: "byHK",
  whatsapp: "919875207137", // TODO: replace with real WhatsApp number (country code + number, no + or spaces)
  instagram: "https://instagram.com/taara_byhk", // TODO: replace with real handle
  email: "himanshikaliya497@gmail.com" // TODO: replace with real support email
};

function threadSVG(width = 600, color = "#c9a15a") {
  // signature "beaded thread" divider — small linked circles, echoing strung bracelets
  const beads = [];
  const n = Math.round(width / 26);
  for (let i = 0; i < n; i++) {
    const x = i * 26 + 13;
    const r = i % 5 === 0 ? 4.5 : 2.6;
    beads.push(`<circle cx="${x}" cy="7" r="${r}" fill="${color}" opacity="${i % 5 === 0 ? 1 : 0.55}"/>`);
  }
  return `<svg viewBox="0 0 ${width} 14" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="7" x2="${width}" y2="7" stroke="${color}" stroke-width="0.6" opacity="0.35"/>
    ${beads.join("")}
  </svg>`;
}

function mountThreads() {
  document.querySelectorAll(".thread").forEach((el) => {
    if (!el.dataset.mounted) {
      el.innerHTML = threadSVG(1000, el.dataset.color || "#c9a15a");
      el.dataset.mounted = "1";
    }
  });
}

function iconSVG(name) {
  const icons = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.3-4.3"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5 10 17l9-10"/></svg>',
    bracelet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none"/><circle cx="20" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="20" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
    necklace: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4c0 7 4 11 8 11s8-4 8-11"/><circle cx="12" cy="16" r="2.3" fill="currentColor" stroke="none"/></svg>',
    charm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v4"/><circle cx="12" cy="13" r="6.5"/></svg>',
    keychain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="7" r="3.5"/><path d="M11 9.5 20 18.5M16 17l2-2M13.5 19.5l2-2"/></svg>',
    all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>'
  };
  return icons[name] || "";
}

function cartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("taara_cart") || "[]");
    return cart.reduce((s, i) => s + i.qty, 0);
  } catch (e) { return 0; }
}

function renderHeader(active) {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="announce">Free shipping across India on orders over <b>₹999</b> · Handwritten notes on every order</div>
    <div class="nav-bar">
      <button class="icon-btn hamburger" id="openDrawer" aria-label="Open menu">${iconSVG("menu")}</button>
      <a href="index.html" class="brand">${SITE.brand}<span class="dot">·</span>${SITE.brandSuffix}</a>
      <nav class="nav-links">
        <a href="shop.html" class="${active==='shop'?'active':''}">All Jewellery</a>
        <a href="shop.html?category=Bracelets" class="${active==='bracelets'?'active':''}">Bracelets</a>
        <a href="shop.html?category=Necklaces">Necklaces</a>
        <a href="shop.html?category=Charms">Charms</a>
        <a href="shop.html?category=Keychains">Keychains</a>
      </nav>
      <div class="nav-actions">
        <a class="icon-btn" href="shop.html" aria-label="Search / shop">${iconSVG("search")}</a>
        <a class="icon-btn" href="account.html" aria-label="Account">${iconSVG("user")}</a>
        <a class="icon-btn" href="cart.html" aria-label="Cart">${iconSVG("bag")}<span class="cart-count" id="cartBadge">${cartCount()}</span></a>
      </div>
    </div>
    <div class="drawer-scrim" id="drawerScrim"></div>
    <div class="mobile-drawer" id="mobileDrawer">
      <button class="drawer-close" id="closeDrawer" aria-label="Close menu">&times;</button>
      <a href="index.html">Home</a>
      <a href="shop.html">All Jewellery</a>
      <a href="shop.html?category=Bracelets">Bracelets</a>
      <a href="shop.html?category=Necklaces">Necklaces</a>
      <a href="shop.html?category=Charms">Charms</a>
      <a href="shop.html?category=Keychains">Keychains</a>
      <a href="cart.html">Cart (${cartCount()})</a>
      <a href="account.html">Account</a>
    </div>
  `;
  const open = document.getElementById("openDrawer");
  const close = document.getElementById("closeDrawer");
  const drawer = document.getElementById("mobileDrawer");
  const scrim = document.getElementById("drawerScrim");
  const toggle = (state) => {
    drawer.classList.toggle("open", state);
    scrim.classList.toggle("open", state);
  };
  open && open.addEventListener("click", () => toggle(true));
  close && close.addEventListener("click", () => toggle(false));
  scrim && scrim.addEventListener("click", () => toggle(false));
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="wrap footer-grid">
      <div>
        <div class="footer-brand">${SITE.brand}<span style="color:var(--gold-bright)">·</span>${SITE.brandSuffix}</div>
        <p style="max-width:280px;opacity:.85;font-size:.86rem;line-height:1.6;">Hand-finished bracelets, charms and everyday fine jewellery, strung and packed in small batches.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>
          <li><a href="shop.html?category=Bracelets">Bracelets</a></li>
          <li><a href="shop.html?category=Necklaces">Necklaces</a></li>
          <li><a href="shop.html?category=Charms">Charms</a></li>
          <li><a href="shop.html?category=Keychains">Keychains</a></li>
        </ul>
      </div>
      <div>
        <h4>Help</h4>
        <ul>
          <li><a href="cart.html">Your Cart</a></li>
          <li><a href="account.html">Track an Order</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        </ul>
      </div>
      <div>
        <h4>Say Hello</h4>
        <ul>
          <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp Us</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>© ${year} TaaraByHK. All pieces are handmade — tiny variations are part of the piece.</span>
      <span>Made with care in India</span>
    </div>
  `;
}

function toast(msg) {
  let t = document.getElementById("globalToast");
  if (!t) {
    t = document.createElement("div");
    t.id = "globalToast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = `<span class="dotgold"></span>${msg}`;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

document.addEventListener("DOMContentLoaded", () => {
  const active = document.body.dataset.nav || "";
  renderHeader(active);
  renderFooter();
  mountThreads();
});
