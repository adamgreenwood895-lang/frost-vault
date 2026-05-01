const DB = {
    hoodies: [
        { name: "FROST HOODIE V1", price: "£85", image: "assets/hoodies/hoodie1.jpg" },
        { name: "FROST HOODIE V2", price: "£85", image: "assets/hoodies/hoodie2.jpg" }
        // ... add others
    ],
    tshirts: [
        { name: "ICE TEE V1", price: "£35", image: "assets/tshirts/tshirt1.jpg" }
    ],
    tracksuits: [
        { name: "SUB-ZERO V1", price: "£120", image: "assets/tracksuits/tracksuit1.jpg" }
    ],
    bags: [
        { name: "ARCTIC V1", price: "£55", image: "assets/bags/bag1.jpg" }
    ]
};

const orb = document.getElementById('orb-trigger');
const cmdDisplay = document.getElementById('cmd-display');
const voiceLabel = document.getElementById('voice-label');

const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = Speech ? new Speech() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
        orb.classList.add('listening');
        voiceLabel.innerText = "LISTENING";
    };

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase();
        cmdDisplay.innerText = transcript;

        // Dynamic Scaling based on speech
        orb.style.transform = `translate(-50%, -50%) scale(${1 + (transcript.length * 0.01)})`;

        if (e.results[0].isFinal) {
            processCommand(transcript);
        }
    };

    recognition.onend = () => {
        orb.classList.remove('listening');
        orb.style.transform = `translate(-50%, -50%) scale(1)`;
        if(voiceLabel.innerText === "LISTENING") voiceLabel.innerText = "FROST";
    };

    orb.onclick = () => recognition.start();
}

function processCommand(cmd) {
    let category = "";
    if (cmd.includes("hoodie")) category = "hoodies";
    if (cmd.includes("shirt") || cmd.includes("tee")) category = "tshirts";
    if (cmd.includes("tracksuit")) category = "tracksuits";
    if (cmd.includes("bag")) category = "bags";

    if (category) {
        voiceLabel.innerText = "MATCHED";
        renderProducts(category);
        setTimeout(() => changeView('products'), 600);
    } else {
        voiceLabel.innerText = "RETRY";
        setTimeout(() => voiceLabel.innerText = "FROST", 1000);
    }
}

function renderProducts(cat) {
    const grid = document.getElementById('product-grid');
    document.getElementById('cat-title').innerText = cat.toUpperCase();
    grid.innerHTML = "";
    
    DB[cat].forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "product-card";
        card.style.transitionDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${item.image}">
            <p style="font-weight:900; margin-top:10px; font-size:12px;">${item.name}</p>
            <p style="color:var(--cyan); font-size:11px;">${item.price}</p>
        `;
        grid.appendChild(card);
    });
}

function changeView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
}
