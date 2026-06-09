// State metadata from 01-bang-dieu-khien-thoi-gian-thuc.md
const stateMetadata = {
    'state-cho': {
        name: 'Wait (Idle)',
        subtitle: 'System Standby / Idle',
        desc: 'No active data collection batch. System is in standby mode waiting for WMS or sensor events.',
        fr: '—',
        tech: ['ASP.NET Core Background Service', 'SQL Server Agent'],
        protocols: ['Idle (Sleep)'],
        connections: 'Transitions to "Event Ingestion" on receiving nhan_su_kien_wms signal.'
    },
    'state-ingest': {
        name: 'Event Ingestion',
        subtitle: 'Consume WMS & SAP event streams',
        desc: 'Consumes live WMS event streams, synchronizes SAP ERP, and registers AI Vision system logs.',
        fr: 'FR-F01',
        tech: ['Apache Kafka', 'REST API', 'SAP RFC Adapter', 'Debezium CDC'],
        protocols: ['HTTP/REST', 'gRPC', 'AMQP'],
        connections: 'Receives signals from "Wait (Idle)" or "Stale Data Warning". Transitions to "KPI Aggregation" when data batch is ready.'
    },
    'state-agg': {
        name: 'KPI Aggregation',
        subtitle: 'Real-time index calculations',
        desc: 'Calculates and aggregates core KPI metrics (inventory, throughput, FEFO compliance...) directly on SQL Server.',
        fr: 'FR-F01',
        tech: ['SQL Server Stored Procedures', 'In-Memory OLTP', 'Entity Framework Core'],
        protocols: ['T-SQL Query', 'ADO.NET Connect'],
        connections: 'Receives signals from "Event Ingestion". Transitions to "SignalR Push" once calculation is complete.'
    },
    'state-signalr': {
        name: 'SignalR Push',
        subtitle: 'Real-time push to Client',
        desc: 'Uses SignalR hub to instantly push compiled KPI update packets to all connected Blazor clients.',
        fr: 'FR-F01',
        tech: ['SignalR Hub', 'ASP.NET Core', 'WebSockets / Server-Sent Events'],
        protocols: ['SignalR Hub Protocol (WebSockets)', 'JSON/MessagePack'],
        connections: 'Receives signals from "KPI Aggregation". Pushes data stream directly to the "Live Dashboard" clients.'
    },
    'state-display': {
        name: 'Live Dashboard',
        subtitle: 'View & monitor live metrics',
        desc: 'Users monitor real-time KPI metrics on a responsive dashboard. Ensures sub-second rendering and refresh.',
        fr: 'FR-F01, FR-F07',
        tech: ['Blazor WebAssembly / Server', 'TailwindCSS', 'SignalR Client SDK'],
        protocols: ['HTTPS (JSON payload)', 'WebSocket connection'],
        connections: 'Active display state. When data age exceeds the freshness threshold, automatically triggers "Stale Data Warning".'
    },
    'state-kpi-display': {
        name: 'KPI Displaying',
        subtitle: 'Live Dashboard sub-state',
        desc: 'Specific KPI cards are rendered and updated on-the-fly whenever new SignalR packets are received.',
        fr: 'FR-F01',
        tech: ['Blazor Components', 'Reactive State Management'],
        protocols: ['SignalR Client Updates'],
        connections: 'Child state of "Live Dashboard". Updates internally.'
    },
    'state-stale': {
        name: 'Stale Data Warning',
        subtitle: 'Freshness threshold exceeded',
        desc: 'Triggers when displayed data stays un-updated for too long (exceeding NFR freshness threshold). Automatically fires a refresh request.',
        fr: 'NFR (Non-Functional Requirement)',
        tech: ['Polly Retry Policy', 'Memory Cache Expiry Monitor'],
        protocols: ['Internal Event Trigger', 'SMTP/Teams Hook Alert'],
        connections: 'Receives signals from "Live Dashboard". Sends yeu_cau_lam_moi request back to "Event Ingestion" to restart the cycle.'
    }
};

// Node relations map for highlighting neighbors
const stateConnections = {
    'state-cho': ['state-ingest'],
    'state-ingest': ['state-cho', 'state-agg'],
    'state-agg': ['state-signalr'],
    'state-signalr': ['state-display'],
    'state-display': ['state-kpi-display', 'state-stale'],
    'state-kpi-display': ['state-display'],
    'state-stale': ['state-ingest']
};

// Zoom and Pan variables
let scale = 0.85;
let panX = 120;
let panY = 50;
let isDragging = false;
let startX, startY;
let activeSimulation = null;
let simulationTimeout = null;
let selectedNodeId = null;
let signalrInterval = null;

// DOM Elements
const viewport = document.getElementById('viewport');
const canvas = document.getElementById('canvas');
const drawer = document.getElementById('details-drawer');
const flowInfo = document.getElementById('flow-info');
const signalrStatusBadge = document.getElementById('signalr-status');

// Canvas Transformations
function updateCanvasTransform() {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

// Set up zoom and pan behaviors
viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.node') || e.target.closest('.flow-control-panel') || e.target.closest('.hud-controls') || e.target.closest('.details-panel') || e.target.closest('.kpi-monitor-panel')) {
        return;
    }
    isDragging = true;
    viewport.style.cursor = 'grabbing';
    startX = e.clientX - panX;
    startY = e.clientY - panY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateCanvasTransform();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
});

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    
    const mouseX = e.clientX - viewport.getBoundingClientRect().left;
    const mouseY = e.clientY - viewport.getBoundingClientRect().top;
    
    const canvasMouseX = (mouseX - panX) / scale;
    const canvasMouseY = (mouseY - panY) / scale;
    
    if (e.deltaY < 0) {
        scale = Math.min(2.5, scale + scale * zoomIntensity);
    } else {
        scale = Math.max(0.4, scale - scale * zoomIntensity);
    }
    
    panX = mouseX - canvasMouseX * scale;
    panY = mouseY - canvasMouseY * scale;
    
    updateCanvasTransform();
});

// Setup HUD controls
document.getElementById('btn-zoom-in').addEventListener('click', () => {
    scale = Math.min(2.5, scale + 0.15);
    updateCanvasTransform();
});

document.getElementById('btn-zoom-out').addEventListener('click', () => {
    scale = Math.max(0.4, scale - 0.15);
    updateCanvasTransform();
});

document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    scale = 0.85;
    panX = 120;
    panY = 50;
    updateCanvasTransform();
});

// Node Selection
const allNodes = document.querySelectorAll('.node');

allNodes.forEach(node => {
    node.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = node.id;
        
        if (selectedNodeId === nodeId) {
            clearSelection();
        } else {
            selectNode(nodeId);
        }
    });
});

function selectNode(nodeId) {
    selectedNodeId = nodeId;
    const meta = stateMetadata[nodeId];
    if (!meta) return;
    
    allNodes.forEach(n => {
        n.classList.remove('selected', 'highlighted');
        n.classList.add('dimmed');
    });
    
    const nodeEl = document.getElementById(nodeId);
    nodeEl.classList.remove('dimmed');
    nodeEl.classList.add('selected');
    
    // Highlight direct neighbors
    const neighbors = stateConnections[nodeId] || [];
    neighbors.forEach(neighId => {
        const neighEl = document.getElementById(neighId);
        if (neighEl) {
            neighEl.classList.remove('dimmed');
            neighEl.classList.add('highlighted');
        }
    });

    // Populate drawer
    document.getElementById('drawer-title').innerText = meta.name;
    document.getElementById('drawer-subtitle').innerText = meta.subtitle;
    document.getElementById('drawer-desc').innerText = meta.desc;
    document.getElementById('drawer-fr').innerText = meta.fr;
    
    // Status text & dot
    const statusText = document.getElementById('drawer-status-text');
    const statusDot = document.getElementById('drawer-status-dot');
    
    if (nodeId === 'state-stale') {
        statusText.innerText = 'Cảnh báo kích hoạt';
        statusText.style.color = 'var(--clr-rose)';
        statusDot.className = 'status-dot stale';
    } else if (nodeId === 'state-cho') {
        statusText.innerText = 'Đang chờ';
        statusText.style.color = 'var(--text-secondary)';
        statusDot.className = 'status-dot planned';
    } else {
        statusText.innerText = 'Sẵn sàng';
        statusText.style.color = 'var(--clr-emerald)';
        statusDot.className = 'status-dot active';
    }

    // Technology Tags
    const techContainer = document.getElementById('drawer-tech-tags');
    techContainer.innerHTML = '';
    meta.tech.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.innerText = t;
        techContainer.appendChild(tag);
    });

    // Protocols
    const protoContainer = document.getElementById('drawer-protocols');
    protoContainer.innerHTML = '';
    meta.protocols.forEach(p => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.style.borderColor = 'rgba(6, 182, 212, 0.2)';
        tag.style.color = 'var(--clr-cyan)';
        tag.innerText = p;
        protoContainer.appendChild(tag);
    });

    document.getElementById('drawer-connections').innerText = meta.connections;

    drawer.classList.add('open');
}

function clearSelection() {
    selectedNodeId = null;
    allNodes.forEach(n => {
        n.classList.remove('selected', 'highlighted', 'dimmed');
    });

    if (activeSimulation) {
        highlightSimulationStep();
    } else {
        const paths = document.querySelectorAll('.connection-path');
        paths.forEach(p => {
            p.classList.remove('active-path', 'signalr-flow', 'aggregation-flow', 'alert-flow');
        });
    }

    drawer.classList.remove('open');
}

document.getElementById('btn-close-drawer').addEventListener('click', clearSelection);
viewport.addEventListener('click', (e) => {
    if (e.target.classList.contains('canvas-viewport') || e.target.id === 'canvas' || e.target.classList.contains('zone-box')) {
        clearSelection();
    }
});

// --- Simulations and Live KPI Updates ---
const flowButtons = document.querySelectorAll('.flow-btn');
const zoneBoxes = document.querySelectorAll('.zone-box');

// KPI Simulated Data Store
const kpiData = {
    inventory: { val: 76.5, trend: 'up', unit: '%', warn: false },
    expiry: { val: 12, trend: 'stable', unit: 'near-expiry batches', warn: true },
    throughput: { val: 145, trend: 'up', unit: 'pallets/hour', warn: false },
    accuracy: { val: 99.82, trend: 'up', unit: '%', warn: false },
    utilization: { val: 84.1, trend: 'stable', unit: '%', warn: false },
    fefo: { val: 98.75, trend: 'up', unit: '%', warn: false },
    aivision: { val: 99.35, trend: 'up', unit: '%', warn: false }
};

// Simulation sequence steps definitions
const simulationFlows = {
    'kpi-cycle': {
        name: 'KPI Aggregation & Push Cycle',
        desc: 'Closed-loop sequence: Ingest WMS signals -> SQL Server Aggregation -> SignalR Push -> Blazor client update.',
        steps: [
            { node: 'state-cho', info: 'Start: System is in Wait (Idle) state. Received event signal from WMS.', pulse: null, path: null, flowType: null },
            { node: 'state-ingest', info: 'Step 1: "Event Ingestion". Consuming Kafka streams, AI Vision logs, and SAP ERP sync.', pulse: 'pulse-cho-ingest', path: 'path-cho-ingest', flowType: 'signalr-flow' },
            { node: 'state-agg', info: 'Step 2: "KPI Aggregation". Data batch is ready, SQL Server triggers calculations.', pulse: 'pulse-ingest-agg', path: 'path-ingest-agg', flowType: 'aggregation-flow' },
            { node: 'state-signalr', info: 'Step 3: "SignalR Push". SignalR Hub receives indices, ready to broadcast.', pulse: 'pulse-agg-signalr', path: 'path-agg-signalr', flowType: 'signalr-flow' },
            { node: 'state-display', info: 'Step 4: Client received SignalR. "Live Dashboard" and "KPI Displaying" update in real-time.', pulse: 'pulse-signalr-display', path: 'path-signalr-display', flowType: 'signalr-flow' }
        ]
    },
    'stale-cycle': {
        name: 'Data Freshness Alert (Stale)',
        desc: 'When data age exceeds freshness threshold (NFR), Blazor client triggers an alert and sends a refresh request.',
        steps: [
            { node: 'state-display', info: 'Start: Client is rendering KPIs normally.', pulse: null, path: null, flowType: null },
            { node: 'state-stale', info: 'Step 1: Update timeout. "Stale Data Warning" is triggered (warning indicator lights up).', pulse: 'pulse-display-stale', path: 'path-display-stale', flowType: 'alert-flow' },
            { node: 'state-ingest', info: 'Step 2: System fires refresh_request. Transitions back to "Event Ingestion" to re-sync.', pulse: 'pulse-stale-ingest', path: 'path-stale-ingest', flowType: 'alert-flow' }
        ]
    }
};

let currentStepIndex = 0;

flowButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const flowId = btn.getAttribute('data-flow');
        
        if (activeSimulation === flowId) {
            stopSimulation();
        } else {
            startSimulation(flowId);
        }
    });
});

function startSimulation(flowId) {
    stopSimulation();
    activeSimulation = flowId;
    currentStepIndex = 0;
    
    const btn = document.querySelector(`.flow-btn[data-flow="${flowId}"]`);
    if (btn) btn.classList.add('active');
    
    flowInfo.classList.add('active');
    
    // Auto-advance simulation loop
    runSimulationLoop();
}

function stopSimulation() {
    if (simulationTimeout) {
        clearTimeout(simulationTimeout);
        simulationTimeout = null;
    }
    
    flowButtons.forEach(b => b.classList.remove('active'));
    flowInfo.classList.remove('active');
    activeSimulation = null;
    
    resetVisualHighlights();
    
    // Clear SignalR live updates if simulation stops
    if (signalrInterval) {
        clearInterval(signalrInterval);
        signalrInterval = null;
    }
    signalrStatusBadge.className = 'signalr-status-badge';
    signalrStatusBadge.querySelector('.badge-text').innerText = 'Waiting for Connection';
}

function runSimulationLoop() {
    const flow = simulationFlows[activeSimulation];
    if (!flow) return;
    
    if (currentStepIndex >= flow.steps.length) {
        // Finished simulation cycle
        if (activeSimulation === 'kpi-cycle') {
            // Activate live updates in client
            signalrStatusBadge.className = 'signalr-status-badge connected';
            signalrStatusBadge.querySelector('.badge-text').innerText = 'SignalR Live';
            startLiveSignalRUpdates();
            flowInfo.innerHTML = `<strong>Cycle Completed</strong><br><p style="margin-top:6px; font-size:0.775rem;">SignalR connection established. KPI widgets below are receiving a continuous data stream.</p>`;
            
            // Highlight the display nodes to show steady state
            highlightSteadyDisplayState();
        } else if (activeSimulation === 'stale-cycle') {
            // Stop updating, set stale
            signalrStatusBadge.className = 'signalr-status-badge stale';
            signalrStatusBadge.querySelector('.badge-text').innerText = 'Stale Data (Alert)';
            setKPIsStale();
            flowInfo.innerHTML = `<strong>Warning Cycle Completed</strong><br><p style="margin-top:6px; font-size:0.775rem;">System sent a refresh request. Standby for reconnection...</p>`;
        }
        return;
    }
    
    highlightSimulationStep();
    
    // Advance step
    currentStepIndex++;
    simulationTimeout = setTimeout(runSimulationLoop, 2500); // 2.5 seconds per step
}

function highlightSimulationStep() {
    const flow = simulationFlows[activeSimulation];
    const step = flow.steps[currentStepIndex];
    
    // Clear previous highlights, but maintain dimmed state for inactive nodes
    resetVisualHighlights();
    
    // Dim all nodes
    allNodes.forEach(n => {
        n.classList.add('dimmed');
        n.classList.remove('highlighted', 'selected');
    });
    
    // Highlight active node
    const activeNode = document.getElementById(step.node);
    if (activeNode) {
        activeNode.classList.remove('dimmed');
        activeNode.classList.add('highlighted');
        
        // Auto select on simulation if sidebar is closed or has selection
        if (selectedNodeId) {
            selectNode(step.node);
        }
    }
    
    // If there is an active connection line/pulse, highlight it
    if (step.pulse) {
        const pulseEl = document.getElementById(step.pulse);
        if (pulseEl) {
            pulseEl.classList.add('active-pulse');
            if (step.flowType === 'signalr-flow') pulseEl.classList.add('pulse-cyan');
            if (step.flowType === 'aggregation-flow') pulseEl.classList.add('pulse-amber');
            if (step.flowType === 'alert-flow') pulseEl.classList.add('pulse-rose');
        }
    }
    
    if (step.path) {
        const pathEl = document.getElementById(step.path);
        if (pathEl) {
            pathEl.classList.add('active-path');
            if (step.flowType === 'signalr-flow') pathEl.classList.add('signalr-flow');
            if (step.flowType === 'aggregation-flow') pathEl.classList.add('aggregation-flow');
            if (step.flowType === 'alert-flow') pathEl.classList.add('alert-flow');
        }
        
        // Highlight SVG markers
        const markers = document.querySelectorAll('marker');
        markers.forEach(m => {
            if (step.flowType === 'signalr-flow') m.classList.add('active-marker-cyan');
            if (step.flowType === 'aggregation-flow') m.classList.add('active-marker-amber');
            if (step.flowType === 'alert-flow') m.classList.add('active-marker-rose');
        });
    }

    // Highlight zone (e.g. Inbound Dashboard area)
    if (step.node === 'state-display' || step.node === 'state-kpi-display') {
        zoneBoxes.forEach(box => box.classList.add('active-zone'));
    } else {
        zoneBoxes.forEach(box => box.classList.remove('active-zone'));
    }
    
    // Update Simulation Panel Text
    flowInfo.innerHTML = `<strong>${flow.name}</strong><br><p style="margin-top:6px; font-size:0.775rem;">${step.info}</p>`;
}

function highlightSteadyDisplayState() {
    // Both display nodes stay highlighted
    allNodes.forEach(n => {
        if (n.id === 'state-display' || n.id === 'state-kpi-display') {
            n.classList.remove('dimmed');
            n.classList.add('highlighted');
        } else {
            n.classList.add('dimmed');
            n.classList.remove('highlighted');
        }
    });
    
    // Highlight inner link
    const pathEl = document.getElementById('path-display-self');
    if (pathEl) {
        pathEl.classList.add('active-path', 'signalr-flow');
    }
    const pulseEl = document.getElementById('pulse-display-self');
    if (pulseEl) {
        pulseEl.classList.add('active-pulse', 'pulse-cyan');
    }
    
    zoneBoxes.forEach(box => box.classList.add('active-zone'));
}

function resetVisualHighlights() {
    // Reset SVG paths
    const paths = document.querySelectorAll('.connection-path');
    paths.forEach(p => {
        p.classList.remove('active-path', 'signalr-flow', 'aggregation-flow', 'alert-flow');
    });

    // Reset pulses
    const pulses = document.querySelectorAll('.flow-pulse');
    pulses.forEach(p => {
        p.className = 'flow-pulse';
    });

    // Reset markers
    const markers = document.querySelectorAll('marker');
    markers.forEach(m => {
        m.className = '';
    });

    // Reset Zones
    zoneBoxes.forEach(box => {
        box.classList.remove('active-zone');
    });

    // Reset Nodes dimmed
    allNodes.forEach(n => {
        n.classList.remove('dimmed', 'highlighted');
    });
}

// --- Live KPI Updates logic ---
function startLiveSignalRUpdates() {
    if (signalrInterval) clearInterval(signalrInterval);
    
    // Reset warnings
    kpiData.expiry.warn = false;
    document.getElementById('card-expiry').classList.remove('warn');
    
    signalrInterval = setInterval(() => {
        // Random walks for KPI metrics
        // 1. Inventory Level
        kpiData.inventory.val = clamp(kpiData.inventory.val + (Math.random() - 0.48) * 1.5, 60, 95);
        // 2. Expiry Warning
        kpiData.expiry.val = Math.max(0, kpiData.expiry.val + (Math.random() > 0.85 ? 1 : (Math.random() > 0.85 ? -1 : 0)));
        // 3. Throughput
        kpiData.throughput.val = Math.round(clamp(kpiData.throughput.val + (Math.random() - 0.5) * 8, 110, 180));
        // 4. Picking Accuracy
        kpiData.accuracy.val = clamp(kpiData.accuracy.val + (Math.random() - 0.45) * 0.05, 99.2, 99.98);
        // 5. Utilization
        kpiData.utilization.val = clamp(kpiData.utilization.val + (Math.random() - 0.5) * 0.5, 75, 92);
        // 6. FEFO Compliance
        kpiData.fefo.val = clamp(kpiData.fefo.val + (Math.random() - 0.4) * 0.1, 95, 100);
        // 7. AI Vision Accuracy
        kpiData.aivision.val = clamp(kpiData.aivision.val + (Math.random() - 0.45) * 0.03, 98.8, 99.99);

        // Check goals/warnings
        if (kpiData.aivision.val < 99.0) {
            kpiData.aivision.warn = true;
            document.getElementById('card-aivision').classList.add('warn');
        } else {
            kpiData.aivision.warn = false;
            document.getElementById('card-aivision').classList.remove('warn');
        }
        
        updateKPIUI();
    }, 1500);
}

function setKPIsStale() {
    if (signalrInterval) clearInterval(signalrInterval);
    
    // Set stale warnings on cards (e.g. increase expiry alert, drop picking precision slightly, mark cards with warn styles)
    kpiData.expiry.val = 19; // Expiry batches pile up
    kpiData.expiry.warn = true;
    document.getElementById('card-expiry').classList.add('warn');
    
    kpiData.aivision.val = 98.85; // Drops below target 99%
    kpiData.aivision.warn = true;
    document.getElementById('card-aivision').classList.add('warn');

    kpiData.inventory.trend = 'stable';
    kpiData.throughput.trend = 'down';
    kpiData.accuracy.trend = 'down';
    kpiData.utilization.trend = 'stable';
    kpiData.fefo.trend = 'down';
    kpiData.aivision.trend = 'down';
    
    updateKPIUI(true);
}

function updateKPIUI(isStaleMode = false) {
    Object.keys(kpiData).forEach(key => {
        const item = kpiData[key];
        const card = document.getElementById(`card-${key}`);
        if (!card) return;
        
        // Add update animation flash
        card.classList.add('updating');
        setTimeout(() => card.classList.remove('updating'), 600);
        
        // Update values
        const valueEl = card.querySelector('.kpi-value');
        if (valueEl) {
            if (key === 'accuracy' || key === 'fefo' || key === 'aivision' || key === 'inventory' || key === 'utilization') {
                valueEl.innerText = item.val.toFixed(2);
            } else {
                valueEl.innerText = item.val;
            }
        }
        
        // Update progress bar fills
        const fillEl = card.querySelector('.kpi-progress-fill');
        if (fillEl) {
            if (key === 'expiry') {
                // Expiry countdown percent (max 30)
                const percent = Math.min(100, (item.val / 30) * 100);
                fillEl.style.width = `${percent}%`;
            } else if (key === 'throughput') {
                // Throughput percent (max 200)
                const percent = (item.val / 200) * 100;
                fillEl.style.width = `${percent}%`;
            } else {
                fillEl.style.width = `${item.val}%`;
            }
        }
        
        // Update trends UI
        const trendEl = card.querySelector('.kpi-trend');
        if (trendEl && !isStaleMode) {
            // Semi-randomly swap trends
            const r = Math.random();
            let trClass = 'kpi-trend stable';
            let trText = '● Stable';
            
            if (r > 0.6) {
                trClass = 'kpi-trend up';
                trText = '▲ Up';
            } else if (r < 0.2) {
                trClass = 'kpi-trend down';
                trText = '▼ Down';
            }
            trendEl.className = trClass;
            trendEl.innerText = trText;
        } else if (trendEl && isStaleMode) {
            if (item.trend === 'down') {
                trendEl.className = 'kpi-trend down';
                trendEl.innerText = '▼ Down';
            } else {
                trendEl.className = 'kpi-trend stable';
                trendEl.innerText = '● Stale';
            }
        }
    });
}

// Utility functions
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Collapsible Simulation Controller
const simulatorPanel = document.getElementById('simulator-panel');
const btnTogglePanel = document.getElementById('btn-toggle-panel');

if (btnTogglePanel && simulatorPanel) {
    btnTogglePanel.addEventListener('click', (e) => {
        e.stopPropagation();
        simulatorPanel.classList.toggle('collapsed');
    });
}

// Initial positioning and drawing
updateCanvasTransform();
updateKPIUI();

// Light/Dark Theme Toggle
const themeToggleBtn = document.getElementById('btn-theme-toggle');
if (themeToggleBtn) {
    const themeText = themeToggleBtn.querySelector('.theme-text');
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeText) {
            themeText.innerText = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        }
    });
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeText) themeText.innerText = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeText) themeText.innerText = 'Light Mode';
    }
}

console.log("Inbound Management Real-time KPI Dashboard visualizer initiated.");


