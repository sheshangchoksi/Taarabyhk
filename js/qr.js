/* TaaraByHK — dynamic UPI payment QR
   Update UPI_ID and MERCHANT_NAME to the store's real UPI handle. */

const UPI_ID = "sheshang304-2@okicici"; // TODO: replace with the real UPI ID for the store
const MERCHANT_NAME = "TaaraByHK";

function buildUpiLink(amount, note) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: MERCHANT_NAME,
    am: String(amount),
    cu: "INR",
    tn: note
  });
  return "upi://pay?" + params.toString();
}

function renderUpiQr(containerEl, amount, orderCode) {
  containerEl.innerHTML = "";
  const link = buildUpiLink(amount, `TaaraByHK Order ${orderCode}`);
  // eslint-disable-next-line no-undef
  new QRCode(containerEl, {
    text: link,
    width: 190,
    height: 190,
    colorDark: "#123638",
    colorLight: "#f6f1e6",
    correctLevel: QRCode.CorrectLevel.M
  });
  return link;
}

function generateOrderCode() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `TH${stamp}${rand}`;
}
