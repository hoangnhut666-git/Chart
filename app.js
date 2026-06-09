// Service metadata database
const nodeMetadata = {
    'node-sap': {
        name: 'SAP S/4HANA IM',
        subtitle: 'Enterprise Resource Planning (ERP)',
        desc: 'The core enterprise system of record for inventory valuation, financial posting, and global stock ledgers. Syncs stock adjustments, sales order lines, and goods receipt notes via Integration Hub.',
        status: 'Active',
        isPlanned: false,
        tech: ['ABAP', 'SAP HANA DB', 'OData Services', 'SAP Integration Suite'],
        protocols: ['REST/HTTPS', 'RFC (Remote Function Call)'],
        connections: 'Connected to Integration Hub / iPaaS (bi-directional sync).'
    },
    'node-attx': {
        name: 'ATTx Track & Trace API',
        subtitle: 'Carrier & Delivery Integration',
        desc: 'External courier gateway API to request parcel tracking numbers, generate shipping labels, and query delivery statuses for outbound logistics orders.',
        status: 'Active',
        isPlanned: false,
        tech: ['Node.js API Gateway', 'OAuth2.0 Security'],
        protocols: ['JSON-RPC over HTTPS', 'Webhooks'],
        connections: 'Connected to Integration Hub / iPaaS for fulfillment label generation.'
    },
    'node-mekong': {
        name: 'Mekong / ASG-North WMS APIs',
        subtitle: '3PL Partner Bridge',
        desc: 'Third-Party Logistics (3PL) API bridge facilitating inventory alignment and shipment handovers between self-managed warehouses and external warehouse networks.',
        status: 'Active',
        isPlanned: false,
        tech: ['Python FastAPI', 'Apache Airflow', 'SFTP Bridge'],
        protocols: ['REST API (HTTPS)', 'EDIFACT/JSON over SFTP'],
        connections: 'Connected to Integration Hub / iPaaS for daily reconciliation files.'
    },
    'node-cameras': {
        name: 'Industrial Cameras x15',
        subtitle: 'Vision Ingestion Layer',
        desc: 'GigE Vision industrial camera network mounted above conveyer lines and loading bays. Captures ultra-high-resolution, low-latency image streams for barcode scanning and volume measurement.',
        status: 'Active',
        isPlanned: false,
        tech: ['Hikvision/Basler Cameras', 'PoE Network Hub'],
        protocols: ['RTSP (Real-Time Streaming Protocol)', 'GigE Vision'],
        connections: 'Streams high-frame-rate video feeds to local AI Vision Edge Cluster.'
    },
    'node-android': {
        name: 'Android Clients',
        subtitle: 'Floor Scanner Handhelds',
        desc: 'Ruggedized Android RF terminals used by picking, packing, and sorting operators on the warehouse floor. Runs the custom lightweight WMS operator app for tasks execution.',
        status: 'Active',
        isPlanned: false,
        tech: ['Android SDK', 'Kotlin', 'SQLite Local DB', 'Jetpack Compose'],
        protocols: ['HTTPS (JSON)', 'WebSockets (Real-time task push)'],
        connections: 'Initiates picking requests via WMS API Gateway + WAF.'
    },
    'node-sensors': {
        name: 'Environmental Sensors',
        subtitle: 'IoT Telemetry (Optional)',
        desc: 'Ambient sensors deployed inside cold storage and fragile goods zones. Captures real-time temperature, humidity, and atmospheric telemetry to safeguard sensitive inventory.',
        status: 'Planned',
        isPlanned: true,
        tech: ['ESP32 Microcontroller', 'DHT22 Sensors', 'Battery-powered node'],
        protocols: ['MQTT (Message Queuing Telemetry Transport)'],
        connections: 'Pushes telemetry packets directly to Integration Hub broker.'
    },
    'node-edge-cluster': {
        name: 'AI Vision Edge Cluster',
        subtitle: 'On-Premises Inference',
        desc: 'Heavy-duty NVIDIA Jetson Edge computing nodes processing live camera frames. Executes local object detection models to read multi-barcodes, estimate packages size, and flags visual quality anomalies.',
        status: 'Active',
        isPlanned: false,
        tech: ['NVIDIA Jetson Orin', 'YOLOv8', 'TensorRT Optimization', 'GStreamer'],
        protocols: ['RTSP Ingestion', 'gRPC (Alert notification)', 'MQTT Metadata'],
        connections: 'Pushes metadata alerts to WMS Core; receives model weights from MLOps registry.'
    },
    'node-gateway': {
        name: 'API Gateway + WAF',
        subtitle: 'Security & Traffic Controller',
        desc: 'Protective border gateway auditing, filtering, and rate-limiting inbound client requests. Block malicious traffic via Web Application Firewall (WAF) rule sets.',
        status: 'Active',
        isPlanned: false,
        tech: ['Nginx Plus', 'AWS WAF / Cloudflare', 'OWASP Core Rule Set'],
        protocols: ['TLS 1.3', 'HTTPS', 'gRPC-Web'],
        connections: 'Proxies authenticated traffic to WMS Core Services.'
    },
    'node-sso': {
        name: 'Azure AD SSO + RBAC',
        subtitle: 'Identity Provider',
        desc: 'Validates user identity and assigns security tokens. Implements Role-Based Access Control (RBAC) to ensure picking operators, supervisors, and sysadmins only access designated endpoints.',
        status: 'Active',
        isPlanned: false,
        tech: ['Microsoft Entra ID (Azure AD)', 'OpenID Connect (OIDC)', 'OAuth 2.0'],
        protocols: ['SAML 2.0', 'OIDC Claims', 'JWT Validation'],
        connections: 'Secures API Gateway routing and matches user permissions.'
    },
    'node-hub': {
        name: 'Integration Hub / iPaaS',
        subtitle: 'Enterprise Service Bus',
        desc: 'Integration engine handling message translation, routing, and reliable delivery. Acts as an orchestration bridge between external systems, partner WMSs, and internal WMS Core.',
        status: 'Active',
        isPlanned: false,
        tech: ['Apache Camel', 'ActiveMQ Message Broker', 'Kubernetes'],
        protocols: ['AMQP', 'JMS', 'HTTPS', 'SFTP'],
        connections: 'Exchanges records with WMS Core, SAP ERP, 3PL APIs, and MQTT sensor payloads.'
    },
    'node-core': {
        name: 'WMS Core Services',
        subtitle: 'Core Business Logic Engine',
        desc: 'The orchestrator of the WMS application. Processes inventory reservation rules, pathfinding for picking waves, container bin allocations, and workflow state transitions.',
        status: 'Active',
        isPlanned: false,
        tech: ['Go (Golang)', 'Spring Boot Microservices', 'Docker', 'gRPC Micro-routing'],
        protocols: ['gRPC (Internal)', 'HTTPS REST (External)', 'Kafka Protocol'],
        connections: 'Direct interfaces with API Gateway, Edge Cluster, Integration Hub, Database and Notification modules.'
    },
    'node-mlops': {
        name: 'AI MLOps + Model Registry',
        subtitle: 'ML Model Management',
        desc: 'Central training and storage facility for neural network weights. Hosts the model registry and monitors edge model inference drift, pushing optimized YOLO weights back to Edge Clusters.',
        status: 'Planned',
        isPlanned: true,
        tech: ['MLflow', 'Triton Inference Server', 'Kubeflow Pipelines', 'MinIO'],
        protocols: ['gRPC', 'HTTPS API'],
        connections: 'Syncs model artifacts to Edge Clusters; triggered by WMS Core analytics logs.'
    },
    'node-sds': {
        name: 'SDS/COA Document Service',
        subtitle: 'Compliance Document Generator',
        desc: 'Handles automated storage and retrieval of Safety Data Sheets (SDS) and Certificate of Analysis (COA) for chemical or hazardous materials stored in the facility.',
        status: 'Active',
        isPlanned: false,
        tech: ['Node.js NestJS', 'PDFKit Generator', 'Metadata Extractor'],
        protocols: ['gRPC', 'HTTPS REST'],
        connections: 'Fetches compliance documents for WMS Core, backing them up in Data Plane Object Storage.'
    },
    'node-notify': {
        name: 'Notification Service',
        subtitle: 'Alerts & Messages Engine',
        desc: 'Event-driven service dispatching real-time notifications to floor managers. Triggers email alerts via SMTP and automated incident cards into Microsoft Teams channels.',
        status: 'Active',
        isPlanned: false,
        tech: ['Go (Golang)', 'SMTP Protocol Adapter', 'MS Teams Webhook Client'],
        protocols: ['SMTP', 'HTTPS JSON Webhooks'],
        connections: 'Subscribes to Event Store topics triggered by WMS Core.'
    },
    'node-reporting': {
        name: 'Reporting Module',
        subtitle: 'Operational Dashboard APIs',
        desc: 'Aggregates current shift picking speed, completed packaging counts, and shipping lane queues. Provides pre-calculated JSON endpoints to fuel supervisor dashboards.',
        status: 'Active',
        isPlanned: false,
        tech: ['Java Micronaut', 'Redis Cache Wrapper', 'JasperReports'],
        protocols: ['REST/HTTPS'],
        connections: 'Reads operational parameters from WMS Core and pushes reports to Analytics/KPI warehouse.'
    },
    'node-db': {
        name: 'Operational Database',
        subtitle: 'High-Concurrency Datastore',
        desc: 'The primary transaction database housing live records of warehouse inventory layouts, item positions, picking waves, and active operator task assignments.',
        status: 'Active',
        isPlanned: false,
        tech: ['PostgreSQL Cluster', 'Patroni High Availability', 'PgBouncer Connection Pool'],
        protocols: ['Native PostgreSQL driver', 'Write-Ahead Logs (WAL)'],
        connections: 'Directly queried and updated by WMS Core Services.'
    },
    'node-events': {
        name: 'Event Store / Outbox',
        subtitle: 'Event Streaming Backbone',
        desc: 'Distributed message log storing append-only business events (e.g. stock-depleted, order-shipped). Implements the transactional Outbox pattern to guarantee event delivery.',
        status: 'Active',
        isPlanned: false,
        tech: ['Apache Kafka', 'Debezium CDC Connector', 'Zookeeper/KRaft'],
        protocols: ['Kafka Broker Protocol', 'CloudEvents schema'],
        connections: 'Receives events from WMS Core and fans them out to Analytics, Audit Log, and Notifications.'
    },
    'node-analytics': {
        name: 'Analytics / KPI Warehouse',
        subtitle: 'OLAP Data Warehouse',
        desc: 'Historical data warehouse used to run large analytical queries. Backs BI visualization tools (like PowerBI / Looker) to monitor overall warehouse efficiency metrics.',
        status: 'Active',
        isPlanned: false,
        tech: ['Google BigQuery', 'dbt (Data Build Tool)', 'Apache Spark'],
        protocols: ['BigQuery API', 'gRPC Data Streams'],
        connections: 'Ingests logs from Event Store and reports from Reporting module.'
    },
    'node-audit': {
        name: 'Immutable Audit Log',
        subtitle: 'Compliance Security Storage',
        desc: 'A secure, write-once-read-many (WORM) storage system containing every single inventory movement and authorization access log, retained for 7 years.',
        status: 'Active',
        isPlanned: false,
        tech: ['Elasticsearch Cloud', 'AWS S3 WORM / Azure Immutable Blob'],
        protocols: ['HTTPS REST'],
        connections: 'Ingests security/operational logs streamed from the Event Store.'
    },
    'node-redis': {
        name: 'Redis Cache & Lock Manager',
        subtitle: 'In-Memory Data Store',
        desc: 'Fast, in-memory cache layer providing distributed locks to prevent pickers from reserving the same item simultaneously. Manages active user session tokens.',
        status: 'Active',
        isPlanned: false,
        tech: ['Redis Sentinel Cluster', 'Redlock Algorithm'],
        protocols: ['Redis Serialization Protocol (RESP)'],
        connections: 'Provides session data and transactional distributed locking to WMS Core.'
    },
    'node-object-store': {
        name: 'Object Storage',
        subtitle: 'Blob & Document Store',
        desc: 'Cloud-based object storage archiving heavy binary assets like printed shipping label PDFs, SDS chemical safety documents, and compliance pictures.',
        status: 'Active',
        isPlanned: false,
        tech: ['MinIO / AWS S3', 'GCP Cloud Storage'],
        protocols: ['S3 API (HTTPS)'],
        connections: 'Retains documents uploaded by the SDS/COA Document Service.'
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
    'node-sso': ['node-gateway', 'node-hub'],
    'node-hub': ['node-sso', 'node-sap', 'node-attx', 'node-mekong', 'node-core', 'node-sensors'],
    'node-core': ['node-gateway', 'node-edge-cluster', 'node-hub', 'node-mlops', 'node-sds', 'node-notify', 'node-reporting', 'node-db', 'node-events', 'node-redis'],
    'node-mlops': ['node-edge-cluster', 'node-core'],
    'node-sds': ['node-core', 'node-object-store'],
    'node-notify': ['node-core'],
    'node-reporting': ['node-core', 'node-analytics'],
    'node-db': ['node-core'],
    'node-events': ['node-core', 'node-analytics', 'node-audit'],
    'node-analytics': ['node-reporting', 'node-events'],
    'node-audit': ['node-events'],
    'node-redis': ['node-core'],
    'node-object-store': ['node-sds']
};

// Flow definitions mapping which lines/pulses trigger during a simulation
const flowDefinitions = {
    'ai-vision': {
        name: 'AI Vision & Quality Alert',
        info: '<strong>Industrial Camera</strong> captures packaging barcode/image → streams via RTSP to <strong>AI Vision Edge Cluster</strong> which detects defect → triggers a REST gRPC alert to <strong>WMS Core Services</strong> → Core records transaction log in <strong>Event Store / Outbox</strong> → <strong>Notification Service</strong> consumes log, firing immediate MS Teams/SMTP alerts to floor manager.',
        pulses: ['pulse-cam-edge', 'pulse-edge-core', 'pulse-core-events', 'pulse-core-notify', 'pulse-events-audit'],
        paths: ['path-cam-edge', 'path-edge-core', 'path-core-events', 'path-core-notify', 'path-events-audit'],
        nodes: ['node-cameras', 'node-edge-cluster', 'node-core', 'node-events', 'node-notify', 'node-audit'],
        zones: [1, 2, 3] // Indices for visual highlighting (1-based: Bien Hoa=1, WMS Platform=2, etc.)
    },
    'order-picking': {
        name: 'Client Picking & Inventory Transaction',
        info: 'Operator scans inventory barcode on <strong>Android Client</strong> → sends API request routed through secure <strong>API Gateway + WAF</strong> → Gateway verifies user tokens via <strong>Azure AD SSO</strong> → requests hit <strong>WMS Core Services</strong> (verifying locks in <strong>Redis</strong>) → Core commits transaction in SQL <strong>Operational Database</strong> and emits audit packet to <strong>Event Store / Outbox</strong> → event streams to <strong>Analytics / KPI Warehouse</strong> for live dashboards.',
        pulses: ['pulse-android-gw', 'pulse-gw-ad', 'pulse-ad-hub', 'pulse-hub-core-forward', 'pulse-core-redis', 'pulse-core-db', 'pulse-core-events', 'pulse-events-analytics'],
        paths: ['path-android-gw', 'path-gw-ad', 'path-ad-hub', 'path-hub-core', 'path-core-redis', 'path-core-db', 'path-core-events', 'path-events-analytics'],
        nodes: ['node-android', 'node-gateway', 'node-sso', 'node-hub', 'node-core', 'node-redis', 'node-db', 'node-events', 'node-analytics'],
        zones: [0, 2, 3] // Enterprise, WMS Platform, Data Plane
    },
    'erp-sync': {
        name: 'ERP SAP & 3PL Integration Sync',
        info: 'Enterprise inventory adjustment triggers in <strong>SAP S/4HANA IM</strong> → secure message routed to <strong>Integration Hub / iPaaS</strong> → Hub converts format and pushes queue to <strong>WMS Core Services</strong> → Core inserts updated records into <strong>Operational Database</strong> and synchronizes temporary cached route definitions inside in-memory <strong>Redis Cache</strong>.',
        pulses: ['pulse-hub-sap-backward', 'pulse-hub-core-forward', 'pulse-core-db', 'pulse-core-redis'],
        paths: ['path-hub-sap', 'path-hub-core', 'path-core-db', 'path-core-redis'],
        nodes: ['node-sap', 'node-hub', 'node-core', 'node-db', 'node-redis'],
        zones: [0, 2, 3]
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
    
    // Status text & dot
    const statusText = document.getElementById('drawer-status-text');
    const statusDot = document.getElementById('drawer-status-dot');
    statusText.innerText = meta.status;
    if (meta.isPlanned) {
        statusDot.className = 'status-dot planned';
        statusText.style.color = 'var(--clr-amber)';
    } else {
        statusDot.className = 'status-dot active';
        statusText.style.color = 'var(--clr-emerald)';
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

    // Related endpoints text
    document.getElementById('drawer-connections').innerText = meta.connections;

    // Open drawer
    drawer.classList.add('open');
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
        p.className = 'flow-pulse'; // resets active-pulse and all custom pulses
    });

    // Reset markers
    const markers = document.querySelectorAll('marker');
    markers.forEach(m => {
        m.className = '';
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
        simulatorPanel.classList.toggle('collapsed');
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

