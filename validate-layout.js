/**
 * Validates consistency between index.html, app.js nodeMetadata,
 * nodeConnections, and flowDefinitions.
 *
 * Usage: node validate-layout.js
 */

const fs = require('fs');
const path = require('path');

const root = __dirname;
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const errors = [];
const warnings = [];

// Extract node IDs from index.html
const nodeIdMatches = [...indexHtml.matchAll(/id="(node-[^"]+)"/g)];
const htmlNodeIds = [...new Set(nodeIdMatches.map(m => m[1]))].filter(id => !id.startsWith('node-') || indexHtml.includes(`class="node" id="${id}"`) || indexHtml.includes(`class="node sys-`));

// More reliable: match div nodes with class containing "node"
const nodeDivMatches = [...indexHtml.matchAll(/<div class="node[^"]*" id="(node-[^"]+)"/g)];
const canvasNodeIds = [...new Set(nodeDivMatches.map(m => m[1]))];

// Extract path IDs from index.html SVG
const pathIdMatches = [...indexHtml.matchAll(/id="(path-[^"]+)"/g)];
const htmlPathIds = new Set(pathIdMatches.map(m => m[1]));

// Extract nodeMetadata keys from app.js
const metadataMatches = [...appJs.matchAll(/'(node-[^']+)':\s*\{/g)];
const metadataKeys = new Set(metadataMatches.map(m => m[1]));

// Extract nodeConnections keys and values
const connectionsBlock = appJs.match(/const nodeConnections = \{([\s\S]*?)\};/);
const connectionKeys = new Set();
const connectionTargets = new Set();
if (connectionsBlock) {
    const keyMatches = [...connectionsBlock[1].matchAll(/'(node-[^']+)':\s*\[/g)];
    keyMatches.forEach(m => connectionKeys.add(m[1]));
    const targetMatches = [...connectionsBlock[1].matchAll(/'(node-[^']+)'/g)];
    targetMatches.forEach(m => connectionTargets.add(m[1]));
}

// Extract flowDefinitions
const flowBlock = appJs.match(/const flowDefinitions = \{([\s\S]*?)\};/);
const flowNodes = new Set();
const flowPaths = new Set();
const flowPulses = new Set();
if (flowBlock) {
    const nodeMatches = [...flowBlock[1].matchAll(/nodes:\s*\[([\s\S]*?)\]/g)];
    nodeMatches.forEach(m => {
        [...m[1].matchAll(/'(node-[^']+)'/g)].forEach(n => flowNodes.add(n[1]));
    });
    const pathMatches = [...flowBlock[1].matchAll(/paths:\s*\[([\s\S]*?)\]/g)];
    pathMatches.forEach(m => {
        [...m[1].matchAll(/'(path-[^']+)'/g)].forEach(p => flowPaths.add(p[1]));
    });
    const pulseMatches = [...flowBlock[1].matchAll(/pulses:\s*\[([\s\S]*?)\]/g)];
    pulseMatches.forEach(m => {
        [...m[1].matchAll(/'(pulse-[^']+)'/g)].forEach(p => flowPulses.add(p[1]));
    });
}

console.log(`Canvas nodes: ${canvasNodeIds.length}`);
console.log(`Metadata entries: ${metadataKeys.size}`);
console.log(`SVG paths: ${htmlPathIds.size}`);
console.log(`Flow paths referenced: ${flowPaths.size}`);
console.log('');

// 1. Every canvas node has metadata
canvasNodeIds.forEach(id => {
    if (!metadataKeys.has(id)) {
        errors.push(`Missing nodeMetadata for canvas node: ${id}`);
    }
});

// 2. Every metadata key has a canvas node
metadataKeys.forEach(id => {
    if (!canvasNodeIds.includes(id)) {
        warnings.push(`nodeMetadata entry has no canvas node: ${id}`);
    }
});

// 3. nodeConnections keys are valid
connectionKeys.forEach(id => {
    if (!metadataKeys.has(id)) {
        errors.push(`nodeConnections key not in nodeMetadata: ${id}`);
    }
});

// 4. nodeConnections targets are valid
connectionTargets.forEach(id => {
    if (!metadataKeys.has(id)) {
        errors.push(`nodeConnections target not in nodeMetadata: ${id}`);
    }
});

// 5. flowDefinitions nodes exist
flowNodes.forEach(id => {
    if (!metadataKeys.has(id)) {
        errors.push(`flowDefinitions node not in nodeMetadata: ${id}`);
    }
});

// 6. flowDefinitions paths exist in HTML
flowPaths.forEach(id => {
    if (!htmlPathIds.has(id)) {
        errors.push(`flowDefinitions path missing from index.html SVG: ${id}`);
    }
});

// 7. flowDefinitions pulses have matching path geometry (pulse-* should exist in HTML)
flowPulses.forEach(id => {
    if (!indexHtml.includes(`id="${id}"`)) {
        errors.push(`flowDefinitions pulse missing from index.html SVG: ${id}`);
    }
});

// 8. Order-picking flow must NOT route through Hub
const orderPickingBlock = appJs.match(/'order-picking':\s*\{([\s\S]*?)\n    \}/);
if (orderPickingBlock) {
    if (orderPickingBlock[1].includes('path-hub-core') || orderPickingBlock[1].includes('path-ad-hub') || orderPickingBlock[1].includes('node-hub')) {
        errors.push('order-picking flow incorrectly routes through Integration Hub or SSO→Hub');
    }
    if (!orderPickingBlock[1].includes('path-gw-core')) {
        errors.push('order-picking flow missing path-gw-core (Gateway → Core direct)');
    }
}

// 9. ai-vision flow should use events→notify not core→notify as primary
const aiVisionBlock = appJs.match(/'ai-vision':\s*\{([\s\S]*?)\n    \}/);
if (aiVisionBlock) {
    if (!aiVisionBlock[1].includes('path-events-notify')) {
        errors.push('ai-vision flow missing path-events-notify (Event Store → Notification)');
    }
    if (aiVisionBlock[1].includes('path-core-notify')) {
        warnings.push('ai-vision flow still references path-core-notify (direct Core→Notify)');
    }
}

// 10. Option A tech stack spot checks
const legacyTechPatterns = [
    { pattern: /Kotlin|Jetpack Compose/, node: 'node-android', label: 'Kotlin/Jetpack' },
    { pattern: /Go \(Golang\)|Spring Boot Microservices/, node: 'node-core', label: 'Go/Spring Boot' },
    { pattern: /Apache Kafka|Debezium/, node: 'node-events', label: 'Kafka/Debezium' },
    { pattern: /Google BigQuery/, node: 'node-analytics', label: 'BigQuery' },
    { pattern: /Java Micronaut|JasperReports/, node: 'node-reporting', label: 'Java Micronaut' },
    { pattern: /Nginx Plus|AWS WAF/, node: 'node-gateway', label: 'Nginx/AWS WAF' },
];

legacyTechPatterns.forEach(({ pattern, node, label }) => {
    const nodeBlock = appJs.match(new RegExp(`'${node}':\\s*\\{([\\s\\S]*?)\\n    \\},`));
    if (nodeBlock && pattern.test(nodeBlock[1])) {
        errors.push(`${node} still contains legacy tech stack (${label}) — expected Option A`);
    }
});

// Report
if (warnings.length) {
    console.log('WARNINGS:');
    warnings.forEach(w => console.log(`  ⚠ ${w}`));
    console.log('');
}

if (errors.length) {
    console.log('ERRORS:');
    errors.forEach(e => console.log(`  ✗ ${e}`));
    console.log(`\nValidation FAILED (${errors.length} error(s), ${warnings.length} warning(s))`);
    process.exit(1);
} else {
    console.log(`Validation PASSED (${warnings.length} warning(s))`);
    process.exit(0);
}
