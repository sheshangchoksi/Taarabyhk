/* TaaraByHK — order submission (Supabase-backed, with offline fallback) */

async function submitOrder(order) {
  // order = { order_code, name, phone, address, city, pincode, items, subtotal, status }
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("orders").insert([{
      order_code: order.order_code,
      customer_name: order.name,
      phone: order.phone,
      address: order.address,
      city: order.city,
      pincode: order.pincode,
      items: order.items,
      subtotal: order.subtotal,
      status: "pending",
      payment_ref: order.payment_ref || null
    }]);
    if (error) {
      console.error("Supabase order insert failed:", error);
      return { ok: false, offline: false, error: error.message };
    }
    return { ok: true, offline: false };
  }
  // Offline fallback so the site is still fully testable before Supabase is wired up
  const key = "taara_orders_offline";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push({ ...order, status: "pending", created_at: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));
  return { ok: true, offline: true };
}

async function fetchOrderByCode(code) {
  const sb = getSupabase();
  if (sb) {
    // Uses the get_order_by_code() function (see supabase-schema.sql) rather
    // than a direct table select, so the public anon key can only ever
    // fetch the one order matching a code the visitor already has.
    const { data, error } = await sb.rpc("get_order_by_code", { code });
    if (error || !data || data.length === 0) return null;
    return data[0];
  }
  const existing = JSON.parse(localStorage.getItem("taara_orders_offline") || "[]");
  return existing.find((o) => o.order_code === code) || null;
}
