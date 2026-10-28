(() => {
let THREE, CSS3DRenderer, CSS3DObject, RoundedBoxGeometry; // filled in by initDesk() from the three.js library loaded in index.html

// The 3D desk: a sleek laptop on a desk mat, in front of a softly glowing arch.
// The laptop's screen is the real web page (#screen) placed into the scene with CSS3DRenderer,
// so its text stays sharp and its buttons stay clickable.

// Screen layout. The DOM screen is 960x600 px (16:10), drawn 4.8 x 3.0 world units.
const SCREEN_PX_W = 960;
const SCREEN_UNITS_W = 4.8;
const SCREEN_UNITS_H = 3.0;
const LID_TILT = 0.3; // how far the lid leans back from vertical (radians)

// 1 = smooth and sharp. Try 0.5 for a chunky low-res "pixel" look.
const RENDER_SCALE = 1;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Textures are drawn at TEX_SCALE x their logical size so prints, notes and wood stay sharp up close.
const TEX_SCALE = 3;

function canvasTexture(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w * TEX_SCALE;
    c.height = h * TEX_SCALE;
    const g = c.getContext('2d');
    g.scale(TEX_SCALE, TEX_SCALE);
    draw(g, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    if (RENDER_SCALE < 1) tex.magFilter = THREE.NearestFilter;
    return tex;
}

function woodTexture() {
    return canvasTexture(512, 512, (g, w, h) => {
        g.fillStyle = '#8c6a49';
        g.fillRect(0, 0, w, h);
        for (let i = 0; i < 90; i++) {
            const y = Math.random() * h;
            g.fillStyle = `rgba(${Math.random() < 0.5 ? '60,38,18' : '190,150,105'},${0.03 + Math.random() * 0.06})`;
            g.fillRect(0, y, w, 1 + Math.random() * 2);
        }
    });
}

function glowTexture() {
    return canvasTexture(128, 128, (g) => {
        const grad = g.createRadialGradient(64, 64, 2, 64, 64, 62);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.35)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 128, 128);
    });
}

function archShape(r, straight) {
    const s = new THREE.Shape();
    s.moveTo(-r, 0);
    s.lineTo(r, 0);
    s.lineTo(r, straight);
    s.absarc(0, straight, r, 0, Math.PI, false);
    s.lineTo(-r, 0);
    return s;
}

function framedArt(w, h, art, frameMat) {
    const g = new THREE.Group();
    const f = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, h + 0.2, 0.12), frameMat);
    f.castShadow = true;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: art, roughness: 0.9 }));
    m.position.z = 0.07;
    g.add(f, m);
    return g;
}

async function initDesk({ stage, screenEl, lib }) {
    ({ THREE, CSS3DRenderer, CSS3DObject, RoundedBoxGeometry } = lib);
    try { await Promise.race([document.fonts.load('48px VT323'), sleep(1500)]); } catch { /* fonts are optional */ }

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Renderers ----------
    const renderer = new THREE.WebGLRenderer({ antialias: RENDER_SCALE === 1, alpha: true });
    renderer.setPixelRatio(RENDER_SCALE === 1 ? Math.min(window.devicePixelRatio, 2) : RENDER_SCALE);
    renderer.domElement.style.imageRendering = RENDER_SCALE < 1 ? 'pixelated' : 'auto';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.prepend(renderer.domElement);

    const css = new CSS3DRenderer();
    css.domElement.classList.add('css-layer');
    stage.append(css.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b141a, 30, 70);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);

    // ---------- Lights ----------
    scene.add(new THREE.HemisphereLight(0x9fc4d0, 0x1a1208, 0.85));
    const key = new THREE.DirectionalLight(0xfff1dc, 1.5);
    key.position.set(-6, 12, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(4096, 4096);
    Object.assign(key.shadow.camera, { left: -22, right: 22, top: 20, bottom: -12, near: 1, far: 60 });
    key.shadow.bias = -0.0004;
    scene.add(key);
    // Cool rim light from behind the arch
    const rim = new THREE.PointLight(0x4de0d0, 30, 22, 2);
    rim.position.set(0, 5, -6);
    scene.add(rim);
    // Screen glow: fades up when the laptop is powered on
    const glow = new THREE.PointLight(0x4dffe6, 0, 14, 2);
    glow.position.set(0, 2.8, 4);
    scene.add(glow);

    // ---------- Wall + arch backdrop ----------
    const wallTex = canvasTexture(8, 256, (g, w, h) => {
        const grad = g.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#16222c');
        grad.addColorStop(0.55, '#1b2e38');
        grad.addColorStop(1, '#0f1a21');
        g.fillStyle = grad;
        g.fillRect(0, 0, w, h);
    });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ map: wallTex, roughness: 1 }));
    wall.position.set(0, 12, -9);
    scene.add(wall);

    // Soft aura behind the arch
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(), color: 0x3fd6c6, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false,
    }));
    aura.scale.set(19, 17, 1);
    aura.position.set(0, 5.2, -8.7);
    // The soft aura sprite is intentionally not added: it left hard rectangular edges on the wall.
    // scene.add(aura);

    // The arch: a thin glowing outline (LED strip) with a muted panel in front
    const ARCH_R = 4.6, ARCH_STRAIGHT = 4.4;
    const archGlow = new THREE.Mesh(
        new THREE.ShapeGeometry(archShape(ARCH_R + 0.16, ARCH_STRAIGHT), 64),
        new THREE.MeshBasicMaterial({ color: 0x7ff7ea }),
    );
    archGlow.position.set(0, 0, -8.62);
    scene.add(archGlow);
    const archPanel = new THREE.Mesh(
        new THREE.ShapeGeometry(archShape(ARCH_R, ARCH_STRAIGHT), 64),
        new THREE.MeshStandardMaterial({ color: 0x2c4a56, roughness: 0.95 }),
    );
    archPanel.position.set(0, 0, -8.55);
    scene.add(archPanel);

    // ---------- Desk + desk mat ----------
    const woodMap = woodTexture();
    woodMap.wrapS = woodMap.wrapT = THREE.RepeatWrapping;
    woodMap.repeat.set(3, 1);
    const desk = new THREE.Mesh(
        new THREE.BoxGeometry(30, 0.6, 17),
        new THREE.MeshStandardMaterial({ map: woodMap, roughness: 0.7 }),
    );
    desk.position.set(0, -0.3, -0.5);
    desk.receiveShadow = true;
    scene.add(desk);

    const mat = new THREE.Mesh(
        new RoundedBoxGeometry(10, 0.05, 5.6, 2, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x1e2a31, roughness: 0.95 }),
    );
    mat.position.set(0, 0.025, 0.7);
    mat.receiveShadow = true;
    scene.add(mat);

    // ---------- Laptop ----------
    const alu = new THREE.MeshStandardMaterial({ color: 0xcdd1d6, metalness: 0.25, roughness: 0.42 });
    const laptop = new THREE.Group();
    scene.add(laptop);

    const base = new THREE.Group();
    base.position.set(0, 0.13, 0.4);
    const baseBody = new THREE.Mesh(new RoundedBoxGeometry(5.4, 0.16, 3.7, 3, 0.06), alu);
    baseBody.castShadow = true;
    baseBody.receiveShadow = true;
    base.add(baseBody);

    const keyMat = new THREE.MeshStandardMaterial({ color: 0x1b1e23, roughness: 0.55 });
    const keys = new THREE.InstancedMesh(new RoundedBoxGeometry(0.3, 0.05, 0.27, 2, 0.02), keyMat, 5 * 14);
    const m4 = new THREE.Matrix4();
    let ki = 0;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 14; c++) {
            m4.setPosition(-2.31 + c * 0.355, 0.1, -1.4 + r * 0.32);
            keys.setMatrixAt(ki++, m4);
        }
    }
    keys.castShadow = true;
    base.add(keys);
    const space = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.05, 0.27, 2, 0.02), keyMat);
    space.position.set(0, 0.1, 0.2);
    base.add(space);
    const pad = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.02, 1.1, 2, 0.01), new THREE.MeshStandardMaterial({ color: 0xb4b8be, roughness: 0.3 }));
    pad.position.set(0, 0.085, 1.05);
    base.add(pad);
    laptop.add(base);

    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.6, 12), new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.5 }));
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, 0.22, -1.45);
    laptop.add(hinge);

    // Lid: pivots at the hinge, leaning back a little
    const lid = new THREE.Group();
    lid.position.set(0, 0.22, -1.45);
    lid.rotation.x = -LID_TILT;
    const LID_W = 5.4, LID_H = 3.6;
    const lidBody = new THREE.Mesh(new RoundedBoxGeometry(LID_W, LID_H, 0.09, 3, 0.04), alu);
    lidBody.position.set(0, LID_H / 2, -0.045);
    lidBody.castShadow = true;
    lid.add(lidBody);
    const bezel = new THREE.Mesh(new THREE.PlaneGeometry(LID_W - 0.16, LID_H - 0.16), new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 0.25 }));
    bezel.position.set(0, LID_H / 2, 0.002);
    lid.add(bezel);
    const cam = new THREE.Mesh(new THREE.CircleGeometry(0.035, 12), new THREE.MeshBasicMaterial({ color: 0x1d2a33 }));
    cam.position.set(0, LID_H - 0.11, 0.004);
    lid.add(cam);
    laptop.add(lid);

    // Tiny power LED on the front edge
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x113311, emissive: 0x000000, roughness: 0.4 });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), ledMat);
    led.position.set(2.45, 0.2, 2.25);
    laptop.add(led);

    // ---------- Props ----------
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x3b2a1a, roughness: 0.7 });
    const walnut = new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 0.7 });

    // Ceramic mug with coffee (left of the laptop)
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xeeeeea, roughness: 0.3, side: THREE.DoubleSide });
    const mug = new THREE.Group();
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.4, 0.9, 28, 1, true), mugMat);
    cup.position.y = 0.45;
    const cupBottom = new THREE.Mesh(new THREE.CircleGeometry(0.4, 28), mugMat);
    cupBottom.rotation.x = -Math.PI / 2;
    cupBottom.position.y = 0.01;
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.43, 28), new THREE.MeshStandardMaterial({ color: 0x2a1408, roughness: 0.3 }));
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.76;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 8, 18, Math.PI), mugMat);
    handle.rotation.z = -Math.PI / 2;
    handle.position.set(0.44, 0.47, 0);
    [cup, cupBottom, handle].forEach((m) => { m.castShadow = true; });
    mug.add(cup, cupBottom, coffee, handle);
    mug.position.set(-4.9, 0.05, 1.2);
    scene.add(mug);

    const steamTex = glowTexture();
    const steam = [0, 1, 2].map((i) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false }));
        s.userData.phase = i / 3;
        mug.add(s);
        return s;
    });

    // Notebook and pen (right of the laptop)
    const notebook = new THREE.Group();
    const nb = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.1, 2.0, 2, 0.03), new THREE.MeshStandardMaterial({ color: 0xe9e2d0, roughness: 0.9 }));
    const nbCover = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.04, 2.0, 2, 0.02), new THREE.MeshStandardMaterial({ color: 0x0f8a8a, roughness: 0.8 }));
    nbCover.position.y = -0.04;
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.5, 8), new THREE.MeshStandardMaterial({ color: 0x1b1e23, roughness: 0.4 }));
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.5;
    pen.position.set(0.1, 0.1, 0.1);
    [nb, nbCover, pen].forEach((m) => { m.castShadow = true; });
    notebook.add(nb, nbCover, pen);
    notebook.position.set(4.9, 0.12, 1.6);
    notebook.rotation.y = -0.25;
    scene.add(notebook);

    // Sleek desk lamp (right, behind the notebook)
    const lamp = new THREE.Group();
    lamp.position.set(6.8, 0, -1.8);
    const black = new THREE.MeshStandardMaterial({ color: 0x1b1e23, roughness: 0.45, metalness: 0.4 });
    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a44a, roughness: 0.4, metalness: 0.4, side: THREE.DoubleSide });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.14, 28), black);
    lampBase.position.y = 0.07;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 10), black);
    pole.position.set(-0.15, 1.35, 0);
    pole.rotation.z = 0.12;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 10), black);
    arm.position.set(-0.8, 2.72, 0);
    arm.rotation.z = 1.23;
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.8, 28, 1, true), brass);
    shade.position.set(-1.4, 2.75, 0);
    shade.rotation.z = 0.25;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfff2c0 }));
    bulb.position.set(-1.43, 2.5, 0);
    [lampBase, pole, arm, shade].forEach((m) => { m.castShadow = true; });
    lamp.add(lampBase, pole, arm, shade, bulb);
    scene.add(lamp);
    const lampLight = new THREE.PointLight(0xffc27a, 20, 14, 2);
    lampLight.position.set(5.4, 2.4, -1.8);
    scene.add(lampLight);

    // Small plant on the desk (left, behind the mug)
    const plant = new THREE.Group();
    plant.position.set(-7.6, 0, -3.2);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 0.9, 20), new THREE.MeshStandardMaterial({ color: 0xe8e4da, roughness: 0.6 }));
    pot.position.y = 0.45;
    pot.castShadow = true;
    plant.add(pot);
    const leafMats = [0x2e9e4f, 0x38b660, 0x25803f].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }));
    for (let i = 0; i < 9; i++) {
        const spin = new THREE.Group();
        spin.rotation.y = (i / 9) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4 + (i % 3) * 0.35, 0.05), leafMats[i % 3]);
        leaf.position.set(0.35, 1.6 + (i % 3) * 0.15, 0);
        leaf.rotation.z = -0.45 - (i % 2) * 0.2;
        leaf.castShadow = true;
        spin.add(leaf);
        plant.add(spin);
    }
    scene.add(plant);

    // ---------- Wall decor ----------
    // Two framed prints on the left
    const sunset = canvasTexture(160, 220, (g, w, h) => {
        const sky = g.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, '#2b1b4a');
        sky.addColorStop(0.55, '#ff7e6b');
        sky.addColorStop(1, '#ffd7a0');
        g.fillStyle = sky;
        g.fillRect(0, 0, w, h);
        g.fillStyle = '#fff1c9';
        g.beginPath(); g.arc(80, 130, 30, 0, Math.PI * 2); g.fill();
        ['#5b3a6e', '#3a2a5a', '#231a3d'].forEach((c, i) => {
            g.fillStyle = c;
            g.beginPath();
            g.moveTo(0, 150 + i * 24);
            for (let x = 0; x <= w; x += 8) g.lineTo(x, 150 + i * 24 + Math.sin(x * 0.08 + i) * 5);
            g.lineTo(w, h); g.lineTo(0, h); g.fill();
        });
    });
    const abstract = canvasTexture(160, 160, (g, w, h) => {
        g.fillStyle = '#ece5d6';
        g.fillRect(0, 0, w, h);
        [['#0f8a8a', 56, 70, 38], ['#e9805c', 100, 86, 28], ['#1b2e38', 78, 112, 20]].forEach(([c, x, y, r]) => {
            g.fillStyle = c;
            g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
        });
    });
    const print1 = framedArt(2.2, 3.0, sunset, darkWood);
    print1.position.set(-8.8, 5.1, -8.8);
    const print2 = framedArt(1.7, 1.7, abstract, walnut);
    print2.position.set(-6.5, 4.4, -8.8);
    scene.add(print1, print2);

    // Floating shelf on the right with books, a plant and a rubber duck
    const shelf = new THREE.Group();
    shelf.position.set(7.2, 5.6, -8.4);
    const board = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.16, 1.0), walnut);
    board.castShadow = true;
    board.receiveShadow = true;
    shelf.add(board);
    [[0xe9e2d0, 1.5], [0x1f3a93, 1.3], [0xb3262e, 1.4]].forEach(([c, w], i) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, 0.8), new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));
        b.position.set(-1.4 + (i % 2) * 0.06, 0.18 + i * 0.2, 0);
        b.castShadow = true;
        shelf.add(b);
    });
    const yellow = new THREE.MeshStandardMaterial({ color: 0xffd23f, roughness: 0.5 });
    const duck = new THREE.Group();
    const duckBody = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), yellow);
    duckBody.scale.set(1, 0.8, 1.15);
    const duckHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), yellow);
    duckHead.position.set(0, 0.4, 0.24);
    const beak = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.18), new THREE.MeshStandardMaterial({ color: 0xff8c1a }));
    beak.position.set(0, 0.37, 0.46);
    duck.add(duckBody, duckHead, beak);
    duck.position.set(0.3, 0.5, 0);
    duck.traverse((m) => { m.castShadow = true; });
    shelf.add(duck);
    const shelfPot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xe8e4da, roughness: 0.6 }));
    shelfPot.position.set(1.7, 0.33, 0);
    shelf.add(shelfPot);
    for (let i = 0; i < 5; i++) {
        const spin = new THREE.Group();
        spin.rotation.y = (i / 5) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.03), leafMats[i % 3]);
        leaf.position.set(0.15, 0.95, 0);
        leaf.rotation.z = -0.4;
        spin.add(leaf);
        spin.position.set(1.7, 0.1, 0);
        shelf.add(spin);
    }
    scene.add(shelf);

    // Sticky note pinned to the arch
    const note = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.95),
        new THREE.MeshStandardMaterial({
            roughness: 0.95,
            map: canvasTexture(128, 128, (g, w, h) => {
                g.fillStyle = '#ffe96b';
                g.fillRect(0, 0, w, h);
                g.fillStyle = '#4a3f00';
                g.font = '28px VT323, monospace';
                g.textAlign = 'center';
                g.fillText('Seeking', w / 2, 46);
                g.fillText('internships', w / 2, 78);
                g.fillText(':)', w / 2, 110);
            }),
        }),
    );
    note.position.set(2.7, 2.6, -8.5);
    note.rotation.z = -0.07;
    scene.add(note);

    // ---------- The screen (DOM), placed on the laptop lid ----------
    laptop.updateMatrixWorld(true);
    const screenWorld = lid.localToWorld(new THREE.Vector3(0, LID_H / 2 - 0.04, 0.012));
    const normal = new THREE.Vector3(0, Math.sin(LID_TILT), Math.cos(LID_TILT)); // direction the screen faces

    const screenObj = new CSS3DObject(screenEl);
    const s = SCREEN_UNITS_W / SCREEN_PX_W;
    screenObj.scale.set(s, s, s);
    screenObj.position.copy(screenWorld);
    screenObj.rotation.x = -LID_TILT;
    scene.add(screenObj);
    screenEl.style.userSelect = 'text'; // CSS3DObject disables selection by default

    // ---------- Camera ----------
    const deskPos = new THREE.Vector3();
    const deskLook = new THREE.Vector3(0, 2.7, 0);
    const zoomPos = new THREE.Vector3();
    const zoomLook = screenWorld.clone();
    const look = new THREE.Vector3();

    function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / h;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        css.setSize(w, h);
        const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        // Desk view: keep the mug, lamp and notebook in frame on narrow windows
        deskPos.set(0, 4.6, Math.max(14, 8 / (tanHalf * aspect)));
        // Zoom view: look straight at the screen, from far enough to fit it with a small margin
        const fit = Math.max(SCREEN_UNITS_H / 2, SCREEN_UNITS_W / 2 / aspect) / tanHalf;
        zoomPos.copy(screenWorld).addScaledVector(normal, fit * 1.12);
    }
    resize();
    window.addEventListener('resize', resize);

    // Gentle parallax with the mouse
    let mx = 0, my = 0, pmx = 0, pmy = 0;
    window.addEventListener('pointermove', (e) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
    });

    let t = 0;          // 0 = desk view, 1 = zoomed to the screen
    let goal = 0;
    let powered = false;
    let last = performance.now();

    function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        const dur = reduce ? 0.01 : 1.5;
        t += Math.sign(goal - t) * Math.min(Math.abs(goal - t), dt / dur);
        const e = ease(t);

        pmx += (mx - pmx) * Math.min(1, dt * 4);
        pmy += (my - pmy) * Math.min(1, dt * 4);
        const amt = reduce ? 0 : THREE.MathUtils.lerp(1, 0.07, e);

        camera.position.lerpVectors(deskPos, zoomPos, e);
        camera.position.x += pmx * 1.4 * amt;
        camera.position.y += -pmy * 0.6 * amt;
        look.lerpVectors(deskLook, zoomLook, e);
        camera.lookAt(look);

        glow.intensity += ((powered ? 12 : 0) - glow.intensity) * Math.min(1, dt * 3);

        if (!reduce) {
            const time = now / 1000;
            steam.forEach((sp) => {
                const p = (time * 0.25 + sp.userData.phase) % 1;
                sp.position.set(Math.sin(time + sp.userData.phase * 6) * 0.08, 0.9 + p * 1.1, 0);
                sp.scale.setScalar(0.25 + p * 0.5);
                sp.material.opacity = 0.22 * Math.sin(p * Math.PI);
            });
            aura.material.opacity = 0.34 + 0.05 * Math.sin(time * 0.8); // slow breathing glow
        }

        renderer.render(scene, camera);
        css.render(scene, camera);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return {
        setZoom(zoomed) { goal = zoomed ? 1 : 0; },
        setPowered(on) {
            powered = on;
            ledMat.color.set(on ? 0x2bff5a : 0x113311);
            ledMat.emissive.set(on ? 0x22ff44 : 0x000000);
        },
    };
}

window.initDesk = initDesk;
})();
