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

const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = Speech ? new Speech() : null;

if (recognition) {
    recognition.onstart = () => {
        orb.classList.add('listening');
        voiceLabel.innerText = "LISTENING";
    };

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase();
        cmdDisplay.innerText = transcript;
        if (e.results[0].isFinal) processCommand(transcript);
    };

    recognition.onend = () => {
        orb.classList.remove('listening');
        if (voiceLabel.innerText === "LISTENING") voiceLabel.innerText = "FROST";
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
        voiceLabel.innerText = "MATCHED";
        renderProducts(cat);
        setTimeout(() => changeView('products'), 600);
    } else {
        voiceLabel.innerText = "RETRY";
        setTimeout(() => voiceLabel.innerText = "FROST", 1200);
    }
}

function changeView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    // Scroll to top of grid when changing views
    if(viewId === 'products') document.getElementById('product-grid').scrollTop = 0;
}

function renderProducts(cat) {
    const grid = document.getElementById('product-grid');
    document.getElementById('cat-title').innerText = cat.toUpperCase();
    grid.innerHTML = "";
    
    DB[cat].forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "product-card";
        card.innerHTML = `
            <img src="${item.image}">
            <p style="font-family:'Syncopate'; font-size:8px; margin-top:10px;">${item.name}</p>
            <p class="price-tag">${item.price}</p>
            <button class="select-btn" onclick='initCheckout(${JSON.stringify(item)})'>SELECT</button>
        `;
        grid.appendChild(card);
    });
}

function initCheckout(item) {
    const card = document.getElementById('checkout-card');
    card.innerHTML = `
        <div class="product-card">
            <img src="${item.image}">
            <p style="font-family:'Syncopate'; font-size:10px; margin-top:10px;">${item.name}</p>
            <p class="price-tag" style="font-size:14px;">${item.price}</p>
        </div>
    `;
    document.getElementById('tracking-ui').style.display = 'none';
    document.getElementById('auth-btn').style.display = 'block';
    changeView('checkout');
}

function startTracking() {
    document.getElementById('auth-btn').style.display = 'none';
    document.getElementById('tracking-ui').style.display = 'block';
    const fill = document.getElementById("trackFill");
    const status = document.getElementById("trackStatus");
    const stages = ["VALIDATING", "ENCRYPTING", "DISPATCHED", "DELIVERED"];

    stages.forEach((txt, i) => {
        setTimeout(() => {
            fill.style.width = ((i + 1) * 25) + "%";
            status.innerText = txt + "...";
            if(i === 3) {
                setTimeout(() => {
                    alert("PROTOCOL COMPLETE. PRODUCT DELIVERED.");
                    changeView('landing');
                }, 1000);
            }
        }, (i + 1) * 1500);
    });
}
