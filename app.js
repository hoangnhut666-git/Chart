// Service metadata database
const nodeMetadata = {
    'node-sap': {
        name: 'SAP S/4HANA IM',
        subtitle: 'Financial & ERP System of Record',
        desc: 'Global Syngenta ERP backbone for materials, BOM, production orders, sales orders, delivery notes, and GR/PGI (Phase 2). WMS holds execution truth at bin level; SAP holds financial truth. Phase 1: WMS confirms pick, staff post PGI manually.',
        status: 'Active',
        isPlanned: false,
        tech: ['ABAP', 'SAP HANA DB', 'SAP Integration Suite', 'SAP BTP CPI'],
        protocols: ['RFC (primary)', 'OData/REST', 'IDoc (Phase 2)'],
        phase: 'Phase 1 & 2',
        integrations: ['INT-01', 'INT-02', 'INT-03', 'INT-04'],
        modules: ['Module H — Master Data', 'Module C — Outbound', 'Module A — GR (Phase 2)']
    },
    'node-attx': {
        name: 'ATTx Track & Trace API',
        subtitle: 'Serialization & Sequence Validation',
        desc: 'Production serialization system placing QR codes on five carton faces with material, batch, dates, serial, and line code. Provides sequence validation and interpolation for hidden cartons during AI Vision INT-06 flows.',
        status: 'Active',
        isPlanned: false,
        tech: ['ATTx REST API', 'OAuth 2.0', 'Azure Key Vault (credentials)'],
        protocols: ['REST/HTTPS', 'OAuth 2.0'],
        phase: 'Phase 1',
        integrations: ['INT-01'],
        modules: ['Module A — Production Inbound', 'Traceability / Sequence Validation']
    },
    'node-mekong': {
        name: 'Mekong / ASG-North WMS APIs',
        subtitle: '3PL Partner Bridge',
        desc: 'Third-party logistics systems for Mekong and ASG-North satellite warehouses. Supports inventory alignment, shipment handovers, and billing reconciliation via adapter pattern (Module D).',
        status: 'Active',
        isPlanned: false,
        tech: ['REST API Adapter', 'Azure Logic Apps', 'SFTP Connector'],
        protocols: ['REST API (HTTPS)', 'SFTP', 'JSON/EDIFACT'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Module D — 3PL Billing & Reconciliation']
    },
    'node-cameras': {
        name: 'Industrial Cameras x15',
        subtitle: 'Vision Ingestion Layer (Module A)',
        desc: 'IP67 industrial cameras (≥5 MP, ≥10 fps) at palletizing stations on 13 production lines. Capture QR, quantity, and packaging defect images with structured lighting or NIR for robot and manual lines.',
        status: 'Active',
        isPlanned: false,
        tech: ['Industrial IP Cameras', 'PoE Network Hub', 'Structured Lighting'],
        protocols: ['RTSP', 'GigE Vision'],
        phase: 'Phase 1',
        integrations: ['INT-05'],
        modules: ['Module A — Production Inbound']
    },
    'node-android': {
        name: 'Handheld RF / Android Clients',
        subtitle: '.NET MAUI RF Clients (INT-10)',
        desc: 'Rugged Android RF terminals for put-away, picking, cycle count, SDS lookup, manual review queue, and exception handling. Vietnamese-primary UI with offline-first sync (30 min cache, 5 min reconcile).',
        status: 'Active',
        isPlanned: false,
        tech: ['.NET MAUI', 'MSAL (Azure AD)', 'SQLite Offline Outbox'],
        protocols: ['HTTPS (JSON)', 'INT-10 via API Gateway'],
        phase: 'Phase 1',
        integrations: ['INT-10'],
        modules: ['Module A — Inbound', 'Module B — Inventory', 'Module C — Outbound', 'Module E — Labor', 'Module I — Compliance']
    },
    'node-sensors': {
        name: 'Environmental Sensors',
        subtitle: 'IoT Telemetry (Optional, INT-09)',
        desc: 'Optional MQTT sensors monitoring warehouse temperature and humidity. Raises QA alerts when readings exceed thresholds for Module I environmental excursion logging.',
        status: 'Planned',
        isPlanned: true,
        tech: ['MQTT IoT Devices', 'Azure IoT Hub'],
        protocols: ['MQTT', 'Azure IoT Hub Protocol'],
        phase: 'Phase 1 (Optional)',
        integrations: ['INT-09'],
        modules: ['Module I — QA & Environmental Compliance']
    },
    'node-edge-cluster': {
        name: 'AI Vision Edge Cluster',
        subtitle: 'On-Premises Inference (INT-05/06)',
        desc: 'NVIDIA Jetson AGX Orin cluster per line zone running real-time inference: QR decode, carton/pallet counting, defect detection, layer-by-layer accumulation, and confidence scoring before WMS acceptance.',
        status: 'Active',
        isPlanned: false,
        tech: ['NVIDIA Jetson AGX Orin', 'DeepStream/GStreamer', 'TensorRT YOLO', 'Azure Cache for Redis (local buffer)'],
        protocols: ['RTSP Ingestion (INT-05)', 'HTTPS/gRPC (INT-06)'],
        phase: 'Phase 1',
        integrations: ['INT-05', 'INT-06'],
        modules: ['Module A — Production Inbound', 'AI Vision Fallback Routing']
    },
    'node-gateway': {
        name: 'API Gateway + WAF',
        subtitle: 'Secure Entry Point',
        desc: 'Single secure entry for RF clients, web admin, and edge nodes (mTLS). Provides TLS termination, rate limiting, WAF protection, correlation IDs, and request routing to WMS Core microservices on AKS.',
        status: 'Active',
        isPlanned: false,
        tech: ['Azure API Management', 'Application Gateway WAF', 'AKS Ingress'],
        protocols: ['TLS 1.2+', 'HTTPS', 'mTLS (edge nodes)'],
        phase: 'Phase 1',
        integrations: ['INT-10'],
        modules: ['Modules A–I — Secure API Access']
    },
    'node-sso': {
        name: 'Azure AD SSO + RBAC',
        subtitle: 'Identity Provider (IAM)',
        desc: 'Microsoft Entra ID authenticates Syngenta corporate users with MFA for administrators. Issues JWT tokens and enforces four roles: Administrator, Warehouse Supervisor, Operator, View-only.',
        status: 'Active',
        isPlanned: false,
        tech: ['Microsoft Entra ID (Azure AD)', 'MSAL', 'OpenID Connect'],
        protocols: ['OIDC', 'JWT Validation', 'SAML 2.0 (federation)'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Cross-cutting — IAM / RBAC']
    },
    'node-hub': {
        name: 'Integration Hub / iPaaS',
        subtitle: 'Enterprise Integration Platform',
        desc: 'Dedicated integration platform and only front door to SAP, ATTx, and 3PL systems. Handles master data sync, real-time SO/DN, message logging, replay, idempotency, and heartbeat monitoring.',
        status: 'Active',
        isPlanned: false,
        tech: ['Integration Hub Worker (.NET)', 'Azure Logic Apps', 'SAP CPI / BTP'],
        protocols: ['RFC', 'HTTPS', 'AMQP', 'SFTP'],
        phase: 'Phase 1 & 2',
        integrations: ['INT-01', 'INT-02', 'INT-03', 'INT-04', 'INT-09'],
        modules: ['Modules A–I — Enterprise Sync', 'Module D — 3PL Integration']
    },
    'node-core': {
        name: 'WMS Core Services',
        subtitle: 'Execution Brain (Modules A–I)',
        desc: 'ASP.NET Core 8 microservices implementing bounded contexts: Inbound, Inventory, Slotting, Outbound, Billing, Labor, Master Data, Compliance, Mcf (Phase 2). Execution truth in WMS; domain events via transactional outbox.',
        status: 'Active',
        isPlanned: false,
        tech: ['ASP.NET Core 8', 'MediatR', 'Docker on AKS', 'Domain Events + Outbox'],
        protocols: ['HTTPS REST (external)', 'gRPC (internal)', 'CloudEvents'],
        phase: 'Phase 1 & 2',
        integrations: ['INT-06', 'INT-10'],
        modules: ['Modules A–I', 'MCF — Manufacturing (Phase 2)']
    },
    'node-mlops': {
        name: 'AI MLOps + Model Registry',
        subtitle: 'ML Model Management (Phase 2)',
        desc: 'Cloud training and versioning for CNN/YOLO models (~500 SKUs). Quarterly retraining, TensorRT export to edge, Grad-CAM explainability, and 7-day rolling accuracy monitoring per line.',
        status: 'Planned',
        isPlanned: true,
        tech: ['Azure Machine Learning', 'CVAT Labeling', 'MLflow Model Registry'],
        protocols: ['HTTPS API', 'Model manifest deploy'],
        phase: 'Phase 2',
        integrations: [],
        modules: ['Module A — AI Vision Model Lifecycle']
    },
    'node-sds': {
        name: 'SDS/COA Document Service',
        subtitle: 'Compliance Document Service (Module I)',
        desc: 'Stores SDS PDFs linked to material codes; OCR/parses COA documents; tracks version and expiry. Serves instant SDS lookup to RF clients on scan for chemical and hazardous materials.',
        status: 'Active',
        isPlanned: false,
        tech: ['ASP.NET Core', 'Azure Blob Storage', 'Azure AI Document Intelligence'],
        protocols: ['HTTPS REST', 'Blob Storage API'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Module A — COA Verification', 'Module I — SDS / MRL Compliance']
    },
    'node-notify': {
        name: 'Notification Service',
        subtitle: 'Alerts & Messages (INT-12)',
        desc: 'Event-driven notifier dispatching SMTP emails and Microsoft Teams webhooks for PGI confirmations, near-expiry alerts, 3PL variance approvals, integration failures, and scheduled reports.',
        status: 'Active',
        isPlanned: false,
        tech: ['ASP.NET Core', 'SMTP Adapter', 'MS Teams Webhook Client'],
        protocols: ['SMTP', 'HTTPS JSON Webhooks (INT-12)'],
        phase: 'Phase 1',
        integrations: ['INT-12'],
        modules: ['Module C — Outbound Alerts', 'Module D — 3PL Variance', 'Module F — Scheduled Reports', 'Module I — Compliance Alerts']
    },
    'node-reporting': {
        name: 'Reporting + BI Embed',
        subtitle: 'Module F — KPI Dashboards',
        desc: 'Real-time KPI dashboards, drag-and-drop report builder, scheduled Excel/PDF distribution, and supervisor tablet layouts. Read-optimized path decoupled from OLTP for P95 <3s floor operations.',
        status: 'Active',
        isPlanned: false,
        tech: ['ASP.NET Core Reporting API', 'Blazor', 'SignalR', 'Power BI Embedded', 'SQL Server'],
        protocols: ['REST/HTTPS', 'SignalR (WebSockets)', 'SQL Server TDS'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Module F — KPI Dashboards & Reporting']
    },
    'node-db': {
        name: 'Operational Database',
        subtitle: 'OLTP — Execution Truth',
        desc: 'Primary transaction store for inventory quantities, locations, tasks, scans, holds, production receipts, and pick lines. Model: Warehouse → Zone → Location → LPN → Handling Unit → Serial.',
        status: 'Active',
        isPlanned: false,
        tech: ['Azure Database for PostgreSQL Flexible Server', 'Schema per Bounded Context', 'Continuous Backup'],
        protocols: ['PostgreSQL Native Driver', 'Write-Ahead Logs (WAL)'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Modules A–I — OLTP Execution Truth']
    },
    'node-events': {
        name: 'Event Store / Outbox',
        subtitle: 'Reliable Domain Events',
        desc: 'Transactional outbox storing domain events (PalletVerified, PickConfirmed, PutawayBlockedByHazard) and integration messages before SAP/ATTx delivery. Guarantees at-least-once delivery.',
        status: 'Active',
        isPlanned: false,
        tech: ['Azure Service Bus', 'Outbox Tables (per service)', 'CloudEvents Schema'],
        protocols: ['Azure Service Bus Protocol', 'CloudEvents'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Modules A–I — Domain Events & Integration Outbox']
    },
    'node-analytics': {
        name: 'Analytics / KPI Warehouse',
        subtitle: 'Historical BI Data Store',
        desc: 'Read-optimized warehouse for throughput, inventory accuracy, FEFO compliance, AI accuracy by line, space utilization, and 3PL cost trends. Feeds Power BI Embedded dashboards (Module F).',
        status: 'Active',
        isPlanned: false,
        tech: ['PostgreSQL Read Replica', 'CDC Pipeline', 'Azure Synapse (optional scale)'],
        protocols: ['PostgreSQL', 'CDC Stream'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Module F — Analytics & BI']
    },
    'node-audit': {
        name: 'Immutable Audit Log',
        subtitle: '7-Year Compliance Ledger',
        desc: 'Append-only audit evidence for every stock mutation and privileged override: user ID, timestamp, action, before/after values. Separate from mutable OLTP; supports legal hold and regulatory inspections.',
        status: 'Active',
        isPlanned: false,
        tech: ['Syngenta.Wms.Audit Service', 'Partitioned Append-Only Tables', 'Azure Immutable Blob (WORM)'],
        protocols: ['HTTPS REST', 'MediatR Audit Pipeline'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Modules A–I — Immutable Compliance Ledger']
    },
    'node-redis': {
        name: 'Redis Cache & Lock Manager',
        subtitle: 'Azure Cache for Redis',
        desc: 'In-memory cache for session state, distributed locks (concurrent pick prevention), hot master data (materials, hazard rules), and precomputed route segments from SAP INT-01 refresh.',
        status: 'Active',
        isPlanned: false,
        tech: ['Azure Cache for Redis', 'Redlock Pattern'],
        protocols: ['Redis Serialization Protocol (RESP)'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Module B — Inventory Locks', 'Module C — Concurrent Pick Prevention', 'Module H — Hot Master Data Cache']
    },
    'node-object-store': {
        name: 'Object Storage',
        subtitle: 'Azure Blob Storage',
        desc: 'Versioned blob store for label PDF/ZPL artifacts, SDS documents, COA uploads, exported report files, and optional model artifacts. AES-256 encryption at rest.',
        status: 'Active',
        isPlanned: false,
        tech: ['Azure Blob Storage', 'SSE (AES-256)', 'Versioning'],
        protocols: ['Azure Blob REST API'],
        phase: 'Phase 1',
        integrations: [],
        modules: ['Module I — Document Storage', 'Module F — Report Artifacts']
    }
};

// Node relations map to highlight adjacent connections on click
const nodeConnections = {
    'node-sap': ['node-hub'],
    'node-attx': ['node-hub'],
    'node-mekong': ['node-hub'],
    'node-cameras': ['node-edge-cluster'],
    'node-android': ['node-gateway'],
    'node-sensors': ['node-hub'],
    'node-edge-cluster': ['node-cameras', 'node-core', 'node-mlops'],
    'node-gateway': ['node-android', 'node-sso', 'node-core'],
    'node-sso': ['node-gateway'],
    'node-hub': ['node-sap', 'node-attx', 'node-mekong', 'node-core', 'node-sensors'],
    'node-core': ['node-gateway', 'node-edge-cluster', 'node-hub', 'node-mlops', 'node-sds', 'node-notify', 'node-reporting', 'node-db', 'node-events', 'node-redis'],
    'node-mlops': ['node-edge-cluster', 'node-core'],
    'node-sds': ['node-core', 'node-object-store'],
    'node-notify': ['node-core', 'node-events'],
    'node-reporting': ['node-core', 'node-analytics'],
    'node-db': ['node-core'],
    'node-events': ['node-core', 'node-analytics', 'node-audit', 'node-notify'],
    'node-analytics': ['node-reporting', 'node-events'],
    'node-audit': ['node-events'],
    'node-redis': ['node-core'],
    'node-object-store': ['node-sds']
};

// Flow definitions mapping which lines/pulses trigger during a simulation
const flowDefinitions = {
    'ai-vision': {
        name: 'AI Vision & Quality Alert',
        info: '<strong>Industrial Camera</strong> streams via <strong>INT-05</strong> (RTSP) to <strong>AI Vision Edge Cluster</strong> → edge infers QR/count/defect and publishes <strong>INT-06</strong> results to <strong>WMS Core Inbound</strong> → Core writes receipt to <strong>Operational DB</strong> and emits <strong>PalletVerified</strong> to <strong>Event Store / Outbox</strong> → <strong>Notification Service</strong> consumes event (MS Teams/SMTP) and <strong>Immutable Audit Log</strong> records evidence.',
        pulses: ['pulse-cam-edge', 'pulse-edge-core', 'pulse-core-events', 'pulse-events-notify', 'pulse-events-audit'],
        paths: ['path-cam-edge', 'path-edge-core', 'path-core-events', 'path-events-notify', 'path-events-audit'],
        nodes: ['node-cameras', 'node-edge-cluster', 'node-core', 'node-events', 'node-notify', 'node-audit'],
        zones: [1, 2, 3] // 0=Enterprise, 1=Bien Hoa, 2=WMS Platform, 3=Data Plane
    },
    'order-picking': {
        name: 'Client Picking & Inventory Transaction',
        info: 'Operator scans barcode on <strong>.NET MAUI RF Client</strong> → <strong>INT-10</strong> request via <strong>API Gateway + WAF</strong> → Gateway validates JWT via <strong>Azure AD SSO</strong> → <strong>WMS Core Outbound</strong> verifies locks in <strong>Azure Cache for Redis</strong> → commits to <strong>Operational DB</strong> (PostgreSQL) and emits event to <strong>Event Store / Outbox</strong> → streams to <strong>Analytics / KPI Warehouse</strong> and <strong>Immutable Audit Log</strong>.',
        pulses: ['pulse-android-gw', 'pulse-gw-ad', 'pulse-gw-core', 'pulse-core-redis', 'pulse-core-db', 'pulse-core-events', 'pulse-events-analytics', 'pulse-events-audit'],
        paths: ['path-android-gw', 'path-gw-ad', 'path-gw-core', 'path-core-redis', 'path-core-db', 'path-core-events', 'path-events-analytics', 'path-events-audit'],
        nodes: ['node-android', 'node-gateway', 'node-sso', 'node-core', 'node-redis', 'node-db', 'node-events', 'node-analytics', 'node-audit'],
        zones: [1, 2, 3] // Bien Hoa, WMS Platform, Data Plane
    },
    'erp-sync': {
        name: 'ERP SAP & 3PL Integration Sync',
        info: 'Master data or SO/DN change in <strong>SAP S/4HANA IM</strong> triggers <strong>INT-01</strong> (scheduled delta) or <strong>INT-03</strong> (real-time SO/DN) via <strong>Integration Hub</strong> → Hub transforms and delivers to <strong>WMS Core</strong> → Core updates <strong>Operational DB</strong> and refreshes hot master data and route cache in <strong>Azure Cache for Redis</strong>.',
        pulses: ['pulse-hub-sap-backward', 'pulse-hub-core-forward', 'pulse-core-db', 'pulse-core-redis'],
        paths: ['path-hub-sap', 'path-hub-core', 'path-core-db', 'path-core-redis'],
        nodes: ['node-sap', 'node-hub', 'node-core', 'node-db', 'node-redis'],
        zones: [0, 2, 3] // Enterprise, WMS Platform, Data Plane
    }
};

// Canvas Pan & Zoom State variables
let scale = 0.75;
let panX = 100;
let panY = 40;
let isDragging = false;
let startX, startY;
let activeFlow = null;
let selectedNodeId = null;
let onlyGlowActive = false;

// DOM Elements
const viewport = document.getElementById('viewport');
const canvas = document.getElementById('canvas');
const drawer = document.getElementById('details-drawer');
const flowInfo = document.getElementById('flow-info');

// Apply transformations to canvas
function updateCanvasTransform() {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

// Set up zoom and pan behaviors
viewport.addEventListener('mousedown', (e) => {
    // Only drag if target is the viewport or the background, not nodes
    if (e.target.closest('.node') || e.target.closest('.flow-control-panel') || e.target.closest('.hud-controls') || e.target.closest('.details-panel')) {
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
    
    // Zoom relative to cursor position
    const mouseX = e.clientX - viewport.getBoundingClientRect().left;
    const mouseY = e.clientY - viewport.getBoundingClientRect().top;
    
    const canvasMouseX = (mouseX - panX) / scale;
    const canvasMouseY = (mouseY - panY) / scale;
    
    if (e.deltaY < 0) {
        scale = Math.min(2.5, scale + scale * zoomIntensity);
    } else {
        scale = Math.max(0.35, scale - scale * zoomIntensity);
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
    scale = Math.max(0.35, scale - 0.15);
    updateCanvasTransform();
});

document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    scale = 0.75;
    panX = 100;
    panY = 40;
    updateCanvasTransform();
});

document.getElementById('btn-toggle-glow').addEventListener('click', (e) => {
    onlyGlowActive = !onlyGlowActive;
    e.currentTarget.classList.toggle('active', onlyGlowActive);
    
    const paths = document.querySelectorAll('.connection-path');
    const nodes = document.querySelectorAll('.node');
    
    if (onlyGlowActive) {
        // Dim everything that isn't part of active flow or connection
        paths.forEach(p => {
            if (!p.classList.contains('active-path')) {
                p.style.opacity = '0.04';
            }
        });
        nodes.forEach(n => {
            if (!n.classList.contains('highlighted') && !n.classList.contains('selected')) {
                n.classList.add('dimmed');
            }
        });
    } else {
        // Reset opacity
        paths.forEach(p => {
            p.style.opacity = '';
        });
        if (!selectedNodeId && !activeFlow) {
            nodes.forEach(n => {
                n.classList.remove('dimmed');
            });
        }
    }
});

// Nodes Interactions
const allNodes = document.querySelectorAll('.node');

allNodes.forEach(node => {
    node.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = node.id;
        
        // Toggle selected state
        if (selectedNodeId === nodeId) {
            clearSelection();
        } else {
            selectNode(nodeId);
        }
    });
});

function selectNode(nodeId) {
    selectedNodeId = nodeId;
    const meta = nodeMetadata[nodeId];
    
    // Highlight clicked node
    allNodes.forEach(n => {
        n.classList.remove('selected');
        n.classList.remove('highlighted');
        n.classList.add('dimmed');
    });
    
    const nodeEl = document.getElementById(nodeId);
    nodeEl.classList.remove('dimmed');
    nodeEl.classList.add('selected');
    
    // Highlight direct neighbors
    const neighbors = nodeConnections[nodeId] || [];
    neighbors.forEach(neighId => {
        const neighEl = document.getElementById(neighId);
        if (neighEl) {
            neighEl.classList.remove('dimmed');
            neighEl.classList.add('highlighted');
        }
    });

    // Dim/highlight SVG connections
    const paths = document.querySelectorAll('.connection-path');
    paths.forEach(p => {
        p.classList.remove('active-path');
        // Let's see if this path connects the selected node
        // In index.html, paths have IDs like "path-cam-edge" etc.
        // We can check if any of the endpoint words match metadata name or node IDs
        // Simplest way is to define which paths light up for each node,
        // or just let the neighbors light up and highlight connection paths.
    });

    // Populate drawer
    document.getElementById('drawer-title').innerText = meta.name;
    document.getElementById('drawer-subtitle').innerText = meta.subtitle;
    document.getElementById('drawer-desc').innerText = meta.desc;

    const phaseEl = document.getElementById('drawer-phase');
    phaseEl.innerText = meta.phase;
    phaseEl.classList.toggle('planned', meta.isPlanned);

    populateDrawerTags('drawer-tech-tags', meta.tech, 'tech-tag');
    populateDrawerTags('drawer-protocols', meta.protocols, 'tech-tag');
    populateDrawerTags('drawer-integrations', meta.integrations, 'tech-tag int-tag', 'No external INT-XX interfaces (internal platform service).');
    populateDrawerTags('drawer-modules', meta.modules, 'tech-tag module-tag');

    // Open drawer
    drawer.classList.add('open');
}

function populateDrawerTags(containerId, items, tagClass, emptyHint) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!items || items.length === 0) {
        if (emptyHint) {
            const hint = document.createElement('p');
            hint.className = 'drawer-empty-hint';
            hint.innerText = emptyHint;
            container.appendChild(hint);
        }
        return;
    }

    items.forEach(item => {
        const tag = document.createElement('span');
        tag.className = tagClass;
        tag.innerText = item;
        container.appendChild(tag);
    });
}

function clearSelection() {
    selectedNodeId = null;
    allNodes.forEach(n => {
        n.classList.remove('selected');
        n.classList.remove('highlighted');
        n.classList.remove('dimmed');
    });

    // If a flow is still active, maintain the flow highlighting
    if (activeFlow) {
        highlightFlow(activeFlow);
    } else {
        // Reset all SVG lines
        const paths = document.querySelectorAll('.connection-path');
        paths.forEach(p => {
            p.classList.remove('active-path', 'ai-flow', 'picking-flow', 'erp-flow');
            if (onlyGlowActive) {
                p.style.opacity = '0.04';
            } else {
                p.style.opacity = '';
            }
        });
    }

    drawer.classList.remove('open');
}

document.getElementById('btn-close-drawer').addEventListener('click', clearSelection);
viewport.addEventListener('click', (e) => {
    // Clear selection if clicking on the background empty viewport space
    if (e.target.classList.contains('canvas-viewport') || e.target.id === 'canvas' || e.target.classList.contains('zone-box')) {
        clearSelection();
    }
});

// Flow Simulation Logic
const flowButtons = document.querySelectorAll('.flow-btn');
const zoneBoxes = document.querySelectorAll('.zone-box');

flowButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const flowId = btn.getAttribute('data-flow');
        
        if (activeFlow === flowId) {
            // Deactivate
            activeFlow = null;
            btn.classList.remove('active');
            flowInfo.classList.remove('active');
            resetFlowVisuals();
        } else {
            // Activate flow
            flowButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFlow = flowId;
            
            const def = flowDefinitions[flowId];
            flowInfo.innerHTML = `<strong>${def.name}</strong><br><p style="margin-top:6px; font-size:0.775rem;">${def.info}</p>`;
            flowInfo.classList.add('active');
            
            highlightFlow(flowId);
        }
    });
});

function highlightFlow(flowId) {
    const def = flowDefinitions[flowId];
    
    // Reset visual classes
    resetFlowVisuals();
    
    // Active specific nodes, dim other nodes
    allNodes.forEach(n => {
        if (def.nodes.includes(n.id)) {
            n.classList.remove('dimmed');
            if (n.id === selectedNodeId) {
                n.classList.add('selected');
            } else {
                n.classList.add('highlighted');
            }
        } else {
            n.classList.add('dimmed');
            n.classList.remove('highlighted');
        }
    });

    // Active specific connection paths
    const flowClass = flowId === 'ai-vision' ? 'ai-flow' : (flowId === 'order-picking' ? 'picking-flow' : 'erp-flow');
    const pulseClass = flowId === 'ai-vision' ? 'pulse-ai' : (flowId === 'order-picking' ? 'pulse-picking' : 'pulse-erp');
    const markerClass = flowId === 'ai-vision' ? 'active-marker-ai' : (flowId === 'order-picking' ? 'active-marker-picking' : 'active-marker-erp');

    def.paths.forEach(pathId => {
        const path = document.getElementById(pathId);
        if (path) {
            path.classList.add('active-path', flowClass);
            path.style.opacity = '1';
        }
    });

    // Active pulses
    def.pulses.forEach(pulseId => {
        const pulse = document.getElementById(pulseId);
        if (pulse) {
            pulse.classList.add('active-pulse', pulseClass);
        }
    });

    // Highlight marker heads in SVG
    const markers = document.querySelectorAll('marker');
    markers.forEach(m => {
        m.classList.add(markerClass);
    });

    // Highlight active zone outlines
    zoneBoxes.forEach((box, index) => {
        if (def.zones.includes(index)) {
            box.classList.add('active-zone');
        } else {
            box.classList.remove('active-zone');
        }
    });
}

function resetFlowVisuals() {
    // Reset SVG paths
    const paths = document.querySelectorAll('.connection-path');
    paths.forEach(p => {
        p.classList.remove('active-path', 'ai-flow', 'picking-flow', 'erp-flow');
        if (onlyGlowActive) {
            p.style.opacity = '0.04';
        } else {
            p.style.opacity = '';
        }
    });

    // Reset pulses
    const pulses = document.querySelectorAll('.flow-pulse');
    pulses.forEach(p => {
        p.classList.remove('active-pulse', 'pulse-ai', 'pulse-picking', 'pulse-erp');
        p.getAnimations().forEach(anim => anim.cancel());
    });

    // Reset markers
    const markers = document.querySelectorAll('marker');
    markers.forEach(m => {
        m.classList.remove('active-marker-ai', 'active-marker-picking', 'active-marker-erp');
    });

    // Reset Zone highlights
    zoneBoxes.forEach(box => {
        box.classList.remove('active-zone');
    });

    // Reset Nodes dimmed status (unless one is still selected)
    if (!selectedNodeId) {
        allNodes.forEach(n => {
            n.classList.remove('dimmed', 'highlighted');
        });
    } else {
        // Re-apply single node select highlights
        selectNode(selectedNodeId);
    }
}

// Toggle Simulator Control Panel collapse/expand
const simulatorPanel = document.getElementById('simulator-panel');
const btnTogglePanel = document.getElementById('btn-toggle-panel');

if (btnTogglePanel && simulatorPanel) {
    btnTogglePanel.addEventListener('click', (e) => {
        e.stopPropagation();
        const willCollapse = !simulatorPanel.classList.contains('collapsed');
        simulatorPanel.classList.toggle('collapsed');

        if (willCollapse && activeFlow) {
            activeFlow = null;
            flowButtons.forEach(b => b.classList.remove('active'));
            flowInfo.classList.remove('active');
            resetFlowVisuals();
        }
    });
}

// Initial draw transform update
updateCanvasTransform();

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
            themeText.innerText = newTheme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng';
        }
    });
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeText) themeText.innerText = 'Chế độ Tối';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeText) themeText.innerText = 'Chế độ Sáng';
    }
}

console.log("WMS Architecture Interactive Map Initiated.");

