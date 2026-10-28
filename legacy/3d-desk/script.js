// ====================================
// Relational Project Leaf Engine Data
// ====================================
const nodeProjectsDataset = {
    "leaf-semeval": {
        title: "Unified Detection of Machine-Generated Code",
        tags: ["NLP", "GraphCodeBERT", "SemEval-2026"],
        problem: "The rise of generative models has made it increasingly difficult to distinguish machine-generated code from human-written code across languages and generation platforms.",
        solution: "Addressed SemEval-2026 Task 13 by compiling data pipelines using structure-aware pre-trained GraphCodeBERT models combined with ensemble learning frameworks.",
        impact: "Significantly scales structural validation integrity barriers over standard baseline validation modules.",
        code: "https://github.com/SHRISH-isback"
    },
    "leaf-insight": {
        title: "InsightGuard: Real-Time Credibility Analysis",
        tags: ["Web Application", "AI", "SEBI Safe Space"],
        problem: "Retail financial market participants remain highly exposed to fraudulent, malicious, or heavily distorted corporate messaging channels.",
        solution: "Built an end-to-end AI validation middleware layer designed to automatically verify announcement patterns alongside current regulatory compliance parameters.",
        impact: "Reduces retail exposure limits to systematic micro-cap market manipulation engines.",
        code: "https://github.com/SHRISH-isback"
    },
    "leaf-phish": {
        title: "PhishGuard - Phishing URL Detector",
        tags: ["Web Application", "Machine Learning", "Security"],
        problem: "Engineered uniform resource locator manipulations intentionally deceive platform consumers into disclosing sensitive structural verification records.",
        solution: "Configured neural monitoring classifiers optimizing network pathway detection vectors synchronously.",
        impact: "Significantly lowers host environment compromise vectors via predictive threat detection.",
        code: "https://github.com/SHRISH-isback"
    },
    "leaf-shell": {
        title: "Custom Shell Implementation",
        tags: ["C", "Systems", "Unix"],
        problem: "Standard high-level terminal applications insulate developers from tracking core low-level OS multi-processing primitives directly.",
        solution: "Programmed a localized execution engine featureset utilizing robust POSIX process logic and clean command token pipelines.",
        impact: "Exposes clear environment isolation parameters while demonstrating micro-kernel pipeline mechanics.",
        code: "https://github.com/SHRISH-isback"
    },
    "leaf-nfs": {
        title: "Network File System",
        tags: ["C", "Networking", "Systems"],
        problem: "Synchronizing dynamic file resources distributed over distinct computing systems introduces heavy concurrent memory fault constraints.",
        solution: "Constructed a client-server storage protocol layer integrating system fault tolerance parameters safely.",
        impact: "Maintains clear structural asset accuracy across distributed environment architectures.",
        code: "https://github.com/SHRISH-isback"
    }
};

// ====================================
// View Controller (Dual Layout Toggling)
// ====================================
const layoutToggle = document.getElementById('layoutToggle');
const graphView = document.getElementById('graphView');
const standardView = document.getElementById('standardView');

layoutToggle.addEventListener('click', () => {
    if (graphView.classList.contains('hidden')) {
        graphView.classList.remove('hidden');
        standardView.classList.add('hidden');
        layoutToggle.innerHTML = '<span>⚡ Switch to Standard Layout</span>';
    } else {
        graphView.classList.add('hidden');
        standardView.classList.remove('hidden');
        layoutToggle.innerHTML = '<span>🌐 Switch to Interactive Graph</span>';
        window.scrollTo({ top: 0 });
    }
});

// ====================================
// Network Graph Core Implementation
// ====================================
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("networkGraph");

    // Base structural configuration elements
    const baseNodes = [
        { id: "core", label: "Shrish Kiran Kadam\nIIIT Hyderabad", size: 30, color: "#6366f1", font: { color: "#ffffff", size: 16, face: "Inter" } },
        { id: "cluster-ml", label: "ML / NLP", size: 24, color: "#8b5cf6", font: { color: "#ffffff", size: 14, face: "Inter" } },
        { id: "cluster-sys", label: "Systems", size: 24, color: "#06b6d4", font: { color: "#ffffff", size: 14, face: "Inter" } },
        { id: "cluster-cyber", label: "Cybersecurity", size: 24, color: "#10b981", font: { color: "#ffffff", size: 14, face: "Inter" } }
    ];

    const baseEdges = [
        { from: "core", to: "cluster-ml", color: { color: "#4f46e5" } },
        { from: "core", to: "cluster-sys", color: { color: "#4f46e5" } },
        { from: "core", to: "cluster-cyber", color: { color: "#4f46e5" } }
    ];

    // Sub-node allocation configurations
    const leafNodesMap = {
        "cluster-ml": [
            { id: "leaf-semeval", label: "Machine Code Detection", color: "#a78bfa" },
            { id: "leaf-insight", label: "InsightGuard AI", color: "#a78bfa" }
        ],
        "cluster-sys": [
            { id: "leaf-shell", label: "Custom Unix Shell", color: "#22d3ee" },
            { id: "leaf-nfs", label: "Network File System", color: "#22d3ee" }
        ],
        "cluster-cyber": [
            { id: "leaf-phish", label: "PhishGuard UI", color: "#34d399" }
        ]
    };

    let visibleNodes = [...baseNodes];
    let visibleEdges = [...baseEdges];
    let expandedClusters = { "cluster-ml": false, "cluster-sys": false, "cluster-cyber": false };

    const nodesDataset = new vis.DataSet(visibleNodes);
    const edgesDataset = new vis.DataSet(visibleEdges);

    const graphData = { nodes: nodesDataset, edges: edgesDataset };

    const graphOptions = {
        nodes: { shape: "dot", font: { face: "Inter" } },
        edges: { width: 2, hoverWidth: 2, selectionWidth: 3 },
        interaction: { hover: true, tooltipDelay: 200, zoomView: true, dragView: true },
        physics: {
            stabilization: { iterations: 150 },
            barnesHut: { gravitationalConstant: -3000, centralGravity: 0.3, springLength: 95, springConstant: 0.04 }
        }
    };

    const network = new vis.Network(container, graphData, graphOptions);

    // Dynamic relational expansion logic
    network.on("click", (params) => {
        if (params.nodes.length === 0) return;
        const selectedId = params.nodes[0];

        // Case A: User clicked a major categorical group cluster block
        if (expandedClusters[selectedId] !== undefined) {
            const isExpanded = expandedClusters[selectedId];
            const leaves = leafNodesMap[selectedId];

            if (!isExpanded) {
                leaves.forEach(leaf => {
                    if (!nodesDataset.get(leaf.id)) {
                        nodesDataset.add({ id: leaf.id, label: leaf.label, size: 18, color: leaf.color, font: { color: "#cbd5e1" } });
                    }
                    edgesDataset.add({ id: `edge-${leaf.id}`, from: selectedId, to: leaf.id, color: { color: "#334155" } });
                });
                expandedClusters[selectedId] = true;
            } else {
                leaves.forEach(leaf => {
                    nodesDataset.remove(leaf.id);
                    edgesDataset.remove(`edge-${leaf.id}`);
                });
                expandedClusters[selectedId] = false;
            }
        } 
        // Case B: User clicked an individual project item node
        else if (nodeProjectsDataset[selectedId]) {
            openProjectSidebar(selectedId);
        }
    });

    // Cursor tracking adjustments for interactive feel
    network.on("hoverNode", () => container.style.cursor = "pointer");
    network.on("blurNode", () => container.style.cursor = "default");
});

// ====================================
// Interactive Details Drawer Logic
// ====================================
const projectSidebar = document.getElementById('projectSidebar');
const closeSidebar = document.getElementById('closeSidebar');

function openProjectSidebar(projectId) {
    const data = nodeProjectsDataset[projectId];
    if (!data) return;

    document.getElementById('sidebarTitle').innerText = data.title;
    document.getElementById('sidebarProblem').innerText = data.problem;
    document.getElementById('sidebarSolution').innerText = data.solution;
    document.getElementById('sidebarImpact').innerText = data.impact;
    document.getElementById('sidebarCodeLink').href = data.code;

    const tagsContainer = document.getElementById('sidebarTags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.innerText = tag;
        tagsContainer.appendChild(span);
    });

    projectSidebar.classList.add('open');
}

closeSidebar.addEventListener('click', () => projectSidebar.classList.remove('open'));

// ====================================
// Standard Mobile Nav Handlers
// ====================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}