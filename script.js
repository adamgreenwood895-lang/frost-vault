const DB = {
    hoodies: [
        { name: "FROST HOODIE V1", price: "£85", image: "assets/hoodies/hoodie1.jpg" },
        { name: "FROST HOODIE V2", price: "£85", image: "assets/hoodies/hoodie2.jpg" },
        { name: "FROST HOODIE V3", price: "£85", image: "assets/hoodies/hoodie3.jpg" },
        { name: "FROST HOODIE V4", price: "£85", image: "assets/hoodies/hoodie4.jpg" }
    ],
    tshirts: [
        { name: "ICE TEE V1", price: "£35", image: "assets/tshirts/tshirt1.jpg" },
        { name: "ICE TEE V2", price: "£35", image: "assets/tshirts/tshirt2.jpg" },
        { name: "ICE TEE V3", price: "£35", image: "assets/tshirts/tshirt3.jpg" },
        { name: "ICE TEE V4", price: "£35", image: "assets/tshirts/tshirt4.jpg" }
    ],
    tracksuits: [
        { name: "SUB-ZERO V1", price: "£120", image: "assets/tracksuits/tracksuit1.jpg" },
        { name: "SUB-ZERO V2", price: "£120", image: "assets/tracksuits/tracksuit2.jpg" },
        { name: "SUB-ZERO V3", price: "£120", image: "assets/tracksuits/tracksuit3.jpg" },
        { name: "SUB-ZERO V4", price: "£120", image: "assets/tracksuits/tracksuit4.jpg" }
    ],
    bags: [
        { name: "ARCTIC V1", price: "£55", image: "assets/bags/bag1.jpg" },
        { name: "ARCTIC V2", price: "£55", image: "assets/bags/bag2.jpg" },
        { name: "ARCTIC V3", price: "£55", image: "assets/bags/bag3.jpg" },
        { name: "ARCTIC V4", price: "£55", image: "assets/bags/bag4.jpg" }
    ]
};

const orb = document.getElementById('orb-trigger');
const cmdDisplay = document.getElementById('cmd-display');
const voiceLabel = document.getElementById('voice-label');

// --- VOICE ENGINE ---
const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = Speech ? new Speech() : null;

if (recognition) {
    recognition.onstart = () => {
        orb.classList.add('listening');
        voiceLabel.innerText = "LISTENING";
    };

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase();
        cmdDisplay.innerText = transcript.toUpperCase();
        
        // Expansion effect
        const scale = 1 + (transcript.length * 0.01);
        orb.style.transform = `scale(${Math.min(scale, 1.2)})`;

        if (e.results[0].isFinal) {
            processCommand(transcript);
        }
    };

    recognition.onend = () => {
        orb.classList.remove('listening');
        orb.style.transform = `scale(1)`;
    };

    orb.onclick = () => recognition.start();
}

function processCommand(cmd) {
    let cat = "";
    if (cmd.includes("hoodie")) cat = "hoodies";
    if (cmd.includes("shirt") || cmd.includes("tee")) cat = "tshirts";
    if (cmd.includes("tracksuit")) cat = "tracksuits";
    if (cmd.includes("bag")) cat = "bags";

    if (cat) {
        voiceLabel.innerText = "ACCESSING";
        renderProducts(cat);
        setTimeout(() => changeView('products'), 800);
    } else {
        voiceLabel.innerText = "RETRY";
        setTimeout(() => voiceLabel.innerText = "FROST", 1200);
    }
}

// --- APP CONTROLLER ---
function changeView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
}

function renderProducts(cat) {
    const grid = document.getElementById('product-grid');
    document.getElementById('cat-title').innerText = cat.toUpperCase();
    grid.innerHTML = "";
    
    DB[cat].forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "product-card";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.innerHTML = `
            <img src="${item.image}">
            <p style="font-family:'Syncopate'; font-size:9px;">${item.name}</p>
            <p style="color:var(--cyan); font-size:12px; margin: 10px 0;">${item.price}</p>
            <button class="select-btn" onclick='initCheckout(${JSON.stringify(item)})'>SELECT_ID</button>
        `;
        grid.appendChild(card);
        setTimeout(() => {
            card.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100);
    });
}

function initCheckout(item) {
    const container = document.getElementById('checkout-card');
    container.innerHTML = `
        <img src="${item.image}">
        <p style="font-family:'Syncopate'; font-size:10px;">${item.name}</p>
        <p style="color:var(--cyan); font-size:14px; margin: 10px 0;">${item.price}</p>
    `;
    changeView('checkout');
}

function startTracking() {
    document.getElementById('tracking-ui').style.display = 'block';
    const fill = document.getElementById("trackFill");
    const status = document.getElementById("trackStatus");
    const stages = ["ENCRYPTING", "MANIFESTING", "DISPATCHED", "DELIVERED"];

    stages.forEach((txt, i) => {
        setTimeout(() => {
            fill.style.width = ((i + 1) * 25) + "%";
            status.innerText = txt + "...";
        }, (i + 1) * 2000);
    });
}
