/* =====================================
   CLIENT PANEL – ADMIN CONNECTED
   ===================================== */

const CURRENT_USER = "awx";        // username client
const ADMIN_WA = "6281617922247";  // WA admin

function getOrders() {
  return JSON.parse(localStorage.getItem("orders") || "[]");
}

/* COUNTDOWN */
function updateCountdown(end) {
  const cdEl = document.getElementById("countdown");
  const statusEl = document.getElementById("status");

  if (!end) {
    cdEl.innerText = "--";
    return;
  }

  const diff = new Date(end).getTime() - Date.now();

  if (diff <= 0) {
    statusEl.innerText = "HABIS";
    statusEl.className = "expired";
    cdEl.innerText = "00 hari 00:00:00";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor(diff / (1000 * 60 * 60) % 24);
  const m = Math.floor(diff / (1000 * 60) % 60);
  const s = Math.floor(diff / 1000 % 60);

  cdEl.innerText =
    `${d} hari ${h.toString().padStart(2,"0")}:` +
    `${m.toString().padStart(2,"0")}:` +
    `${s.toString().padStart(2,"0")}`;

  statusEl.innerText = "AKTIF";
  statusEl.className = "active";

  if (diff <= 3600000) {
    statusEl.innerText = "SEGERA HABIS";
    statusEl.classList.add("warning");
  }
}

/* LOAD CLIENT DATA */
function loadClient() {
  const orders = getOrders();
  const myOrder = orders.filter(o => o.user === CURRENT_USER).pop();
  if (!myOrder) return;

  ipInfo.innerText = myOrder.ip || "--";
  specInfo.innerText = myOrder.product || "--";
  osInfo.innerText = myOrder.os || "--";
  regionInfo.innerText = myOrder.region || "--";
  userName.innerText = myOrder.rdp_user || myOrder.user;

  buyDate.innerText = myOrder.start || "--";
  expireDate.innerText = myOrder.end || "--";

  updateCountdown(myOrder.end);

  // PERPANJANG
  const terminal = document.getElementById("terminalExtend");
const terminalText = document.getElementById("terminalText");

document.getElementById("extendBtn").onclick = () => {
  terminal.style.display = "flex";
  terminalText.textContent = "";

  const lines = [
    ">> Initializing secure channel...",
    ">> Reading order data...",
    ">> Verifying service...",
    ">> Preparing WhatsApp payload...",
    ">> Redirecting to admin..."
  ];

  let i = 0;

  const typing = setInterval(() => {
    terminalText.textContent += lines[i] + "\n";
    i++;

    if (i === lines.length) {
      clearInterval(typing);

      setTimeout(() => {
        terminal.style.display = "none";

        const msg =
`Halo admin AXP-Tech 👋

Saya ingin *PERPANJANG RDP / VPS*

📌 Username   : ${myOrder.user}
🌐 IP         : ${myOrder.ip}
💾 Spesifikasi: ${myOrder.product}
🖥️ OS         : ${myOrder.os}
📍 Region     : ${myOrder.region}

📅 Berlaku Sampai:
${myOrder.end}

Terima kasih 🙏`;

        window.open(
          `https://wa.me/${ADMIN_WA}?text=` + encodeURIComponent(msg),
          "_blank"
        );

      }, 1000);
    }
  }, 500);
};
}

setInterval(loadClient, 1000);
document.addEventListener("DOMContentLoaded", loadClient);