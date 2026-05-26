// State coordinator
class AppState {
    constructor() {
        this.sales = 142500;
        this.profit = 58300;
        this.parsed = false;
        
        this.principal = 10000;
        this.monthly = 1500;
        this.rate = 12;
        this.simMode = "balanced";
        
        this.oppScore = 88;
        this.health = "Growth Accelerating";
    }

    getReinvestRate() {
        if (this.simMode === "conservative") return 30;
        if (this.simMode === "aggressive") return 65;
        return 45;
    }
}

const state = new AppState();

// Nav routing
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const targetView = item.getAttribute("data-view");
        document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
        document.getElementById(targetView).classList.add("active");
        
        if (targetView === "dashboard") {
            setTimeout(renderAllCharts, 100);
        }
    });
});

// Interactive Forecasting Simulators
function calculateCompounding() {
    const years = 5;
    const labels = [];
    const dataPoints = [];
    
    let currentVal = state.principal;
    const annualRate = state.rate / 100;
    const monthlyRate = annualRate / 12;
    const monthlyAddition = state.monthly;

    for (let month = 0; month <= years * 12; month++) {
        if (month % 12 === 0) {
            labels.push(`Year ${month / 12}`);
            dataPoints.push(Math.round(currentVal));
        }
        currentVal = currentVal * (1 + monthlyRate) + monthlyAddition;
    }

    window.WealthCharts.initForecastChart("forecastChart", labels, dataPoints);
    document.getElementById("forecast-mode-label").innerText = `Mode: ${state.simMode.toUpperCase()}`;
}

function updateAllocations() {
    const total = state.sales;
    
    const rReinvest = state.getReinvestRate();
    const rLiquidity = 15;
    const rCommodity = 20;
    const rLongterm = 15;
    const rAI = 100 - (rReinvest + rLiquidity + rCommodity + rLongterm);

    const business = Math.round(total * (rReinvest / 100));
    const emergency = Math.round(total * (rLiquidity / 100));
    const commodity = Math.round(total * (rCommodity / 100));
    const stocks = Math.round(total * (rLongterm / 100));
    const ai = Math.round(total * (rAI / 100));

    document.getElementById("alloc-business").innerText = `$${business.toLocaleString()}`;
    document.getElementById("alloc-emergency").innerText = `$${emergency.toLocaleString()}`;
    document.getElementById("alloc-commodity").innerText = `$${commodity.toLocaleString()}`;
    document.getElementById("alloc-stocks").innerText = `$${stocks.toLocaleString()}`;
    document.getElementById("alloc-ai").innerText = `$${ai.toLocaleString()}`;

    window.WealthCharts.initAllocationChart(
        "allocationChart",
        ["Business", "Emergency", "Commodities", "Long-term", "AI & Education"],
        [business, emergency, commodity, stocks, ai]
    );

    updateMemoryStatePreview();
}

function renderAllCharts() {
    calculateCompounding();
    updateAllocations();
}

// Bind sliders
const sliderP = document.getElementById("slider-principal");
const sliderM = document.getElementById("slider-monthly");
const sliderR = document.getElementById("slider-rate");
const simSelect = document.getElementById("sim-mode");

sliderP.addEventListener("input", (e) => {
    state.principal = parseFloat(e.target.value);
    document.getElementById("label-principal").innerText = `$${state.principal.toLocaleString()}`;
    calculateCompounding();
});

sliderM.addEventListener("input", (e) => {
    state.monthly = parseFloat(e.target.value);
    document.getElementById("label-monthly").innerText = `$${state.monthly.toLocaleString()}`;
    calculateCompounding();
});

sliderR.addEventListener("input", (e) => {
    state.rate = parseFloat(e.target.value);
    document.getElementById("label-rate").innerText = `${state.rate}%`;
    calculateCompounding();
});

simSelect.addEventListener("change", (e) => {
    state.simMode = e.target.value;
    updateAllocations();
    calculateCompounding();
});

// Billionaire Chat Integration
const personaList = document.getElementById("persona-list");
const chatInput = document.getElementById("chat-input-field");
const chatSend = document.getElementById("chat-send-btn");
const chatContainer = document.getElementById("chat-messages-container");

function initChatPersonas() {
    personaList.innerHTML = "";
    Object.keys(BILLIONAIRE_PERSONAS).forEach(key => {
        const pers = BILLIONAIRE_PERSONAS[key];
        const isActive = window.BillionaireAI.currentPersona === key ? "active" : "";
        
        const item = document.createElement("div");
        item.className = `persona-item ${isActive}`;
        item.innerHTML = `
            <div class="persona-img">${pers.emoji}</div>
            <div class="persona-details">
                <span class="persona-name">${pers.name}</span>
                <span class="persona-quote">"${pers.quote}"</span>
            </div>
        `;
        
        item.addEventListener("click", () => {
            document.querySelectorAll(".persona-item").forEach(p => p.classList.remove("active"));
            item.classList.add("active");
            
            window.BillionaireAI.setPersona(key);
            document.getElementById("chat-active-name").innerText = pers.name;
            document.getElementById("chat-active-title").innerText = pers.title;
            
            // Add initial welcome from active mentor
            appendMessage("ai", `Hello. ${pers.quote} I am active to advise you on your Ozo Journey. Ask me about our strategies.`);
        });
        
        personaList.appendChild(item);
    });
}

function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatSend.addEventListener("click", triggerChatResponse);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") triggerChatResponse();
});

function triggerChatResponse() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage("user", text);
    chatInput.value = "";

    // Generate response reflecting current state
    setTimeout(() => {
        const payload = {
            parsed: state.parsed,
            sales: state.sales,
            profit: state.profit,
            health: state.health,
            reinvestRate: state.getReinvestRate(),
            oppScore: state.oppScore
        };
        const result = window.BillionaireAI.generateResponse(text, payload);
        appendMessage("ai", result.text);
        updateMemoryStatePreview();
    }, 600);
}

// Drag & Drop CSV Ledger Import
const dropzone = document.getElementById("csv-dropzone");
const csvFileInput = document.getElementById("csv-file-input");

dropzone.addEventListener("click", () => csvFileInput.click());
dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--primary)";
});
dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "rgba(255, 215, 0, 0.2)";
});
dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleCSVFile(file);
});
csvFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleCSVFile(file);
});

function handleCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const ok = window.ExcelParser.parseCSV(event.target.result);
        if (ok) {
            const summary = window.ExcelParser.summary;
            state.sales = summary.sales;
            state.profit = summary.profit;
            state.parsed = true;
            state.health = summary.health;
            
            // Update UI elements
            document.getElementById("dash-sales").innerText = `$${state.sales.toLocaleString()}`;
            document.getElementById("dash-profit").innerText = `$${state.profit.toLocaleString()}`;
            document.getElementById("business-health-status").innerText = state.health;
            
            const pulse = document.getElementById("health-pulse");
            pulse.className = "pulse-indicator " + summary.healthIndicator;

            // Render alerts
            const alertsCont = document.getElementById("excel-alerts-container");
            alertsCont.innerHTML = "";
            summary.alerts.forEach(alert => {
                const item = document.createElement("div");
                item.style.padding = "12px";
                item.style.borderRadius = "8px";
                item.style.border = "1px solid rgba(255,255,255,0.05)";
                item.style.background = alert.type === "danger" ? "rgba(239, 68, 68, 0.08)" : "rgba(255,215,0,0.03)";
                item.style.fontSize = "13px";
                item.innerText = alert.text;
                alertsCont.appendChild(item);
            });

            // Render predictive ordering
            const predCont = document.getElementById("predictive-orders-container");
            predCont.innerHTML = "";
            summary.predictiveOrders.forEach(ord => {
                const item = document.createElement("div");
                item.style.padding = "12px";
                item.style.borderRadius = "8px";
                item.style.border = "1px solid rgba(255,255,255,0.03)";
                item.style.background = "rgba(0,0,0,0.1)";
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <strong>${ord.product}</strong>
                        <span style="color:var(--primary); font-size:11px;">${ord.status}</span>
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary);">${ord.action}</div>
                `;
                predCont.appendChild(item);
            });

            document.getElementById("excel-analytics-panel").style.display = "grid";
            updateAllocations();
            
            alert("Ledger ingested successfully. Wealth metrics & dashboard allocations updated!");
        } else {
            alert("Failed to parse CSV ledger.");
        }
    };
    reader.readAsText(file);
}

// NotebookLM audio wave controls
const btnAudioPlay = document.getElementById("btn-audio-play");
const btnAudioStop = document.getElementById("btn-audio-stop");
const audioWave = document.getElementById("audio-wave");
const audioIndicator = document.getElementById("audio-playing-indicator");
let audioWaveTimer = null;

btnAudioPlay.addEventListener("click", () => {
    audioWave.classList.add("playing");
    audioIndicator.style.display = "inline-block";
    btnAudioPlay.style.display = "none";
    btnAudioStop.style.display = "flex";

    // Dynamic wave bar heights
    const bars = document.querySelectorAll(".wave-bar");
    audioWaveTimer = setInterval(() => {
        bars.forEach(bar => {
            const h = Math.random() * 0.9 + 0.1;
            bar.style.transform = `scaleY(${h})`;
        });
    }, 150);
});

btnAudioStop.addEventListener("click", () => {
    audioWave.classList.remove("playing");
    audioIndicator.style.display = "none";
    btnAudioPlay.style.display = "flex";
    btnAudioStop.style.display = "none";
    
    clearInterval(audioWaveTimer);
    const bars = document.querySelectorAll(".wave-bar");
    bars.forEach(bar => {
        bar.style.transform = "scaleY(0.15)";
    });
});

// Portability export/import handlers
const btnExport = document.getElementById("btn-export-memory");
const importFileInput = document.getElementById("import-file-input");

btnExport.addEventListener("click", () => {
    const backupState = {
        platform: "Ozo Journey",
        version: "1.0.0",
        synced_account: "owenzomitho5",
        business_sales: state.sales,
        business_profit: state.profit,
        reinvestment_mode: state.simMode,
        strategist_memory: window.BillionaireAI.memoryLog
    };
    window.DataPortability.exportMemory(backupState);
});

importFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        window.DataPortability.importMemory(file, (ok, parsed) => {
            if (ok) {
                state.sales = parsed.business_sales || 142500;
                state.profit = parsed.business_profit || 58300;
                state.simMode = parsed.reinvestment_mode || "balanced";
                window.BillionaireAI.memoryLog = parsed.strategist_memory || [];
                
                // Update UI elements
                document.getElementById("dash-sales").innerText = `$${state.sales.toLocaleString()}`;
                document.getElementById("dash-profit").innerText = `$${state.profit.toLocaleString()}`;
                simSelect.value = state.simMode;
                
                updateAllocations();
                calculateCompounding();
                updateMemoryStatePreview();
                
                alert("Memory imported successfully!");
            } else {
                alert("Invalid memory backup file.");
            }
        });
    }
});

function updateMemoryStatePreview() {
    const preview = {
        platform: "Ozo Journey",
        version: "1.0.0",
        active_mentor: BILLIONAIRE_PERSONAS[window.BillionaireAI.currentPersona].name,
        synced_account: "owenzomitho5",
        business_sales: state.sales,
        business_profit: state.profit,
        sim_mode: state.simMode,
        memory_logs_count: window.BillionaireAI.memoryLog.length
    };
    document.getElementById("memory-state-preview").innerText = JSON.stringify(preview, null, 2);
}

// Initialise everything
window.addEventListener("DOMContentLoaded", () => {
    initChatPersonas();
    renderAllCharts();
    updateMemoryStatePreview();
});
