document.addEventListener("DOMContentLoaded",()=>{

const specGrid=document.getElementById("specGrid");
const osGrid=document.getElementById("osGrid");
const regionGrid=document.getElementById("regionGrid");
const addBtn=document.getElementById("addBtn");
const cartItems=document.getElementById("cartItems");
const cartCount=document.getElementById("cartCount");
const totalEl=document.getElementById("total");
const waBtn=document.getElementById("waBtn");
const waLoading=document.getElementById("waLoading");
waBtn.classList.add("disabled");
let selectedSpec=null,selectedOS=null,selectedRegion=null;
let osType="windows";
let cart=JSON.parse(localStorage.getItem("axpCart"))||[];

const specs=[
{name:"1 GB RAM • 1 vCPU",price:5000},
{name:"2 GB RAM • 1 vCPU",price:6000},
{name:"2 GB RAM • 2 vCPU",price:7000},
{name:"4 GB RAM • 2 vCPU",price:9000},
{name:"8 GB RAM • 4 vCPU",price:16000},
{name:"16 GB RAM • 4 vCPU",price:25000},
{name:"16 GB RAM • 8 vCPU",price:30000},
];

const osList={
windows:["Windows Server 2012 R2","Windows Server 2019","Windows Server 2022","Windows 10 Pro"],
linux:["Ubuntu 25.04","Ubuntu 24.04 LTS","Ubuntu 22.04 LTS"]
};

const regions=[
{name:"Singapore",flag:"🇸🇬"},
{name:"Germany",flag:"🇩🇪"},
{name:"Netherlands",flag:"🇳🇱"},
{name:"Australia",flag:"🇦🇺"},
{name:"Canada",flag:"🇨🇦"},
{name:"England",flag:"🇬🇧"},
{name:"India",flag:"🇮🇳"}
];

renderSpecs();renderOS();renderRegions();renderCart();checkReady();

function renderSpecs(){
specGrid.innerHTML="";
specs.forEach(s=>{
const d=card(`${s.name}<b style="margin-top:6px">Rp ${s.price.toLocaleString()}</b>`);
d.onclick=()=>select(d,()=>{selectedSpec=s;scroll("osBox")});
specGrid.appendChild(d);
});
}

function renderOS(){
osGrid.innerHTML="";
osList[osType].forEach(o=>{
const d=card(o);
d.onclick=()=>select(d,()=>{selectedOS=o;scroll("regionBox")});
osGrid.appendChild(d);
});
}

function renderRegions(){
regionGrid.innerHTML="";
regions.forEach(r=>{
const d=card(`<div style="font-size:22px">${r.flag}</div>${r.name}`);
d.onclick=()=>select(d,()=>selectedRegion=r.name);
regionGrid.appendChild(d);
});
}

function card(html){
const d=document.createElement("div");
d.className="select-card";
d.innerHTML=html;
return d;
}

function select(el,cb){
el.parentElement.querySelectorAll(".select-card").forEach(x=>x.classList.remove("active"));
el.classList.add("active");
cb();updateSteps();checkReady();
}

function checkReady(){
addBtn.disabled=!(selectedSpec&&selectedOS&&selectedRegion);
addBtn.classList.toggle("disabled",addBtn.disabled);
}

function updateSteps(){
stepSpec.className="step "+(selectedSpec?"done":"active");
stepOS.className="step "+(selectedOS?"done":"active");
stepRegion.className="step "+(selectedRegion?"done":"active");
}

function scroll(id){
document.getElementById(id).scrollIntoView({behavior:"smooth",block:"center"});
}

const toast=document.getElementById("toast");

addBtn.onclick=()=>{
  cart.push({
    spec:selectedSpec,
    os:selectedOS,
    region:selectedRegion,
    platform:osType.toUpperCase()
  });

  localStorage.setItem("axpCart",JSON.stringify(cart));
  renderCart();

  /* POPUP */
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);

  /* SCROLL KE CART */
  setTimeout(()=>{
    document.getElementById("cartItems")
      .scrollIntoView({behavior:"smooth",block:"start"});
  },300);
};

function renderCart(){
cartItems.innerHTML="";
let total=0;
cart.forEach((c,i)=>{
total+=c.spec.price;
cartItems.innerHTML+=`
<div class="cart-item">
<b>${c.platform}</b><br>${c.spec.name}<br>${c.os}<br>${c.region}
<b><br>Rp ${c.spec.price.toLocaleString()}</b>
<button onclick="removeItem(${i})">Remove</button>
</div>`;
});
cartCount.innerText=cart.length;
totalEl.innerText="Rp "+total.toLocaleString();
// WA button enable / disable
if(cart.length){
  waBtn.classList.remove("disabled");
}else{
  waBtn.classList.add("disabled");
}
}

const toastRemove=document.getElementById("toastRemove");

window.removeItem=i=>{
  cart.splice(i,1);
  localStorage.setItem("axpCart",JSON.stringify(cart));
  renderCart();

  /* POPUP DIHAPUS */
  toastRemove.classList.add("show");
  setTimeout(()=>toastRemove.classList.remove("show"),1800);
};

window.switchOS=(type,btn)=>{
osType=type;
document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
btn.classList.add("active");
selectedOS=null;
renderOS();
checkReady();
};



waBtn.onclick = () => {
  if(!cart.length) return alert("Cart kosong!");

  waLoading.classList.remove("hidden");

  let msg =
`━━━━━━━━━━━━━━━━━━
 *AXP-TECH | ORDER RDP/VPS*
━━━━━━━━━━━━━━━━━━
`;

  cart.forEach((c,i)=>{
    msg +=
`━━━━━━━━━━━━━━━━━━
📦 *ORDER ${i+1}*
━━━━━━━━━━━━━━━━━━
🖥️ Platform : ${c.platform}
⚙️ Spec     : ${c.spec.name}
💿 OS       : ${c.os}
🌍 Region   : ${c.region}
💰 Harga   : Rp ${c.spec.price.toLocaleString()}
`;
  });

  msg +=
`
━━━━━━━━━━━━━━━━━━
💳 *TOTAL*
━━━━━━━━━━━━━━━━━━
💰 Rp ${cart.reduce((t,c)=>t+c.spec.price,0).toLocaleString()}

⚠️ *CATATAN*
━━━━━━━━━━━━━━━━━━
• Kirim *Nickname* saat chat
• Pembayaran = Aktivasi
• Client Panel dibuat manual

🚀 *AXP-TECH*
━━━━━━━━━━━━━━━━━━
`;

  setTimeout(()=>{
    waLoading.classList.add("hidden");
    window.open(
      "https://wa.me/6281617922247?text=" + encodeURIComponent(msg),
      "_blank"
    );
  },4500);
};

});


// OPEN POPUP (tombol CEK IP)
document.getElementById("cekIpBtn").onclick = () => {
  document.getElementById("authPopup").classList.remove("hidden");
};

// CLOSE POPUP
document.getElementById("closeAuth").onclick = () => {
  document.getElementById("authPopup").classList.add("hidden");
};

// LOGIN
document.addEventListener("DOMContentLoaded", ()=>{

  const terminalMain = document.getElementById("terminalMain");
  const terminalMainText = document.getElementById("terminalMainText");
  const btnLogin = document.getElementById("btnLogin");
  const loginUser = document.getElementById("loginUser");

  btnLogin.addEventListener("click", ()=>{
    const username = loginUser.value.trim();

    if(!username){
      alert("Username wajib diisi");
      return;
    }

    // TAMPILKAN TERMINAL
    terminalMain.style.display = "flex";
    terminalMainText.textContent = "";

    const lines = [
      ">> Authenticating user...",
      ">> Validating client directory...",
      ">> Loading client environment...",
      ">> Redirecting to client panel..."
    ];

    let i = 0;
    const run = setInterval(()=>{
      terminalMainText.textContent += lines[i] + "\n";
      i++;

      if(i === lines.length){
        clearInterval(run);

        setTimeout(()=>{
          terminalMain.style.display = "none";
          window.location.href = "/client/" + username + "/";
        }, 1200);
      }
    }, 450);
  });

});


const legalTerminal = document.getElementById("legalTerminal");
const legalContent  = document.getElementById("legalContent");
const legalTitle    = document.getElementById("legalTitle");

const disclaimerText = `
DISCLAIMER LAYANAN
━━━━━━━━━━━━━━━━━━

1. Layanan ini ditujukan untuk penggunaan RDP/VPS harian dan tidak diperuntukkan untuk jangka panjang.

2. Tidak disarankan menyimpan data penting karena RDP/VPS dapat mati sewaktu-waktu jika terjadi kendala server.

3. Untuk pengolahan data, disarankan menggunakan aplikasi online seperti:
- Google Docs
- Google Sheets
- MS Word Online
- MS Excel Online
- VS Code Online

4. Disarankan menggunakan tools backup otomatis seperti:
Google Drive, Dropbox, Github, atau sejenisnya.
`;

const tosText = `
TOS PENGGUNAAN RDP / VPS
━━━━━━━━━━━━━━━━━━

1. Dilarang melakukan mining berbasis CPU seperti XMRIG, Minergate, dll.

2. Dilarang menginstall panel atau tools untuk kegiatan Scam / Phishing.

3. Aktivitas Hardcore seperti:
Scanning, PortScan, DDoS, Dump, Exploit, Hacking
WAJIB menggunakan VPN / SSH / Proxy
(Berlaku juga untuk OS Linux)

* Pelanggaran dapat menyebabkan Server Suspend
  dan Droplet Mati Masal.
`;

function showLegal(title, text){
  legalTitle.textContent = title;
  legalContent.textContent = "";
  legalTerminal.classList.remove("hidden");

  let i = 0;
  const chars = text.split("");
  const type = setInterval(()=>{
    legalContent.textContent += chars[i];
    i++;
    if(i >= chars.length) clearInterval(type);
  }, 8);
}

document.getElementById("btnDisclaimer").onclick = ()=>{
  showLegal("AXP-Tech | Disclaimer", disclaimerText);
};

document.getElementById("btnTOS").onclick = ()=>{
  showLegal("AXP-Tech | TOS", tosText);
};

document.getElementById("closeLegal").onclick = ()=>{
  legalTerminal.classList.add("hidden");
};
