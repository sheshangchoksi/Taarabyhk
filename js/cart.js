/* TaaraByHK — cart, backed by localStorage (device-local, no login required) */

const CART_KEY = "taara_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function addToCart(product, qty = 1) {
  const cart = readCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      qty
    });
  }
  writeCart(cart);
}

function updateCartQty(id, qty) {
  let cart = readCart();
  if (qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.qty = qty;
  }
  writeCart(cart);
}

function removeFromCart(id) {
  const cart = readCart().filter((i) => i.id !== id);
  writeCart(cart);
}

function cartSubtotal(cart) {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function clearCart() {
  writeCart([]);
}
