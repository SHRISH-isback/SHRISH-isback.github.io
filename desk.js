(() => {
let THREE, CSS3DRenderer, CSS3DObject, RoundedBoxGeometry; // filled in by initDesk() from the three.js library loaded in index.html

// The 3D desk: a beige CRT monitor, keyboard and desk props built from simple shapes.
// The monitor's screen is the real web page (#screen) placed into the scene with CSS3DRenderer,
// so its text stays sharp and its buttons stay clickable.


// Screen layout (world units). The DOM screen is 800x600 px, drawn 4 x 3 units wide.
const SCREEN_PX_W = 800;
const SCREEN_UNITS_W = 4;
const SCREEN_Y = 3.5;
const SCREEN_Z = 0.9;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function canvasTexture(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter; // crisp pixels when textures are enlarged
    return tex;
}

function woodTexture() {
    return canvasTexture(512, 512, (g, w, h) => {
        g.fillStyle = '#7b5232';
        g.fillRect(0, 0, w, h);
        for (let i = 0; i < 70; i++) {
            const y = Math.random() * h;
            g.fillStyle = `rgba(${Math.random() < 0.5 ? '40,22,8' : '150,105,65'},${0.06 + Math.random() * 0.1})`;
            g.fillRect(0, y, w, 1 + Math.random() * 3);
        }
    });
}

function floppy(color, label) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.05, 0.95),
        new THREE.MeshStandardMaterial({ color, roughness: 0.6 }),
    );
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);

    const shutter = new THREE.Mesh(
        new THREE.PlaneGeometry(0.46, 0.34),
        new THREE.MeshStandardMaterial({ color: 0xc8c8c8, metalness: 0.6, roughness: 0.4 }),
    );
    shutter.rotation.x = -Math.PI / 2;
    shutter.position.set(0, 0.026, -0.3);
    g.add(shutter);

    if (label) {
        const tex = canvasTexture(128, 96, (c, w, h) => {
            c.fillStyle = '#f4f1e6';
            c.fillRect(0, 0, w, h);
            c.fillStyle = '#222';
            c.font = '36px VT323, monospace';
            c.textAlign = 'center';
            c.fillText(label, w / 2, h / 2 + 12);
        });
        const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), new THREE.MeshBasicMaterial({ map: tex }));
        lab.rotation.x = -Math.PI / 2;
        lab.position.set(0, 0.026, 0.2);
        g.add(lab);
    }
    return g;
}

async function initDesk({ stage, screenEl, lib }) {
    ({ THREE, CSS3DRenderer, CSS3DObject, RoundedBoxGeometry } = lib);
    try { await Promise.race([document.fonts.load('48px VT323'), sleep(1500)]); } catch { /* fonts are optional */ }

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Renderers ----------
    // Pixel-art look: draw the scene at half resolution and let the browser scale it up with hard pixel edges
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(0.5);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.prepend(renderer.domElement);

    const css = new CSS3DRenderer();
    css.domElement.classList.add('css-layer');
    stage.append(css.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x061617, 22, 48);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // ---------- Lights ----------
    scene.add(new THREE.HemisphereLight(0x8fd0cc, 0x1a1208, 1.0));
    const sun = new THREE.DirectionalLight(0xfff0d8, 1.7);
    sun.position.set(-6, 12, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 10, bottom: -8, near: 1, far: 40 });
    sun.shadow.bias = -0.0004;
    scene.add(sun);
    // Screen glow: fades up when the computer is powered on
    const glow = new THREE.PointLight(0x4dffe6, 0, 16, 2);
    glow.position.set(0, SCREEN_Y, 3);
    scene.add(glow);

    // ---------- Room ----------
    const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 30),
        new THREE.MeshStandardMaterial({ color: 0x0e3234, roughness: 1 }),
    );
    wall.position.set(0, 10, -9);
    wall.receiveShadow = true;
    scene.add(wall);

    const woodMap = woodTexture();
    woodMap.wrapS = woodMap.wrapT = THREE.RepeatWrapping;
    woodMap.repeat.set(3, 1);
    const desk = new THREE.Mesh(
        new THREE.BoxGeometry(30, 0.6, 17),
        new THREE.MeshStandardMaterial({ map: woodMap, roughness: 0.75 }),
    );
    desk.position.set(0, -0.3, -0.5);
    desk.receiveShadow = true;
    scene.add(desk);

    const poster = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 5.4),
        new THREE.MeshStandardMaterial({
            roughness: 0.9,
            map: canvasTexture(256, 346, (g, w, h) => {
                g.fillStyle = '#f2ecd6';
                g.fillRect(0, 0, w, h);
                g.fillStyle = '#008080';
                g.fillRect(14, 14, w - 28, 120);
                g.fillStyle = '#fff';
                g.font = '44px VT323, monospace';
                g.textAlign = 'center';
                g.fillText('HELLO,', w / 2, 70);
                g.fillText('WORLD!', w / 2, 116);
                g.fillStyle = '#222';
                g.font = '26px VT323, monospace';
                ['int main() {', '  learn();', '  build();', '  return 0;', '}'].forEach((l, i) => {
                    g.textAlign = 'left';
                    g.fillText(l, 34, 176 + i * 32);
                });
            }),
        }),
    );
    poster.position.set(8.5, 6.5, -8.9);
    poster.rotation.z = -0.03;
    scene.add(poster);

    // ---------- Monitor ----------
    const beige = new THREE.MeshStandardMaterial({ color: 0xd8d0b6, roughness: 0.72, metalness: 0.03 });
    const beigeDark = new THREE.MeshStandardMaterial({ color: 0xc4bb9f, roughness: 0.8, metalness: 0.03 });
    const monitor = new THREE.Group();
    scene.add(monitor);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.3, 40), beigeDark);
    base.position.set(0, 0.15, -0.3);
    const neck = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.7, 2.0, 3, 0.1), beigeDark);
    neck.position.set(0, 0.6, -0.3);
    const housing = new THREE.Mesh(new RoundedBoxGeometry(6, 5, 1.6, 5, 0.2), beige);
    housing.position.set(0, 3.2, 0);
    const rear = new THREE.Mesh(new RoundedBoxGeometry(4.6, 3.9, 3.2, 5, 0.35), beigeDark);
    rear.position.set(0, 3.5, -2.1);
    const lip = new THREE.Mesh(
        new RoundedBoxGeometry(4.5, 3.5, 0.12, 3, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x1b1b19, roughness: 0.5 }),
    );
    lip.position.set(0, SCREEN_Y, 0.82);
    [base, neck, housing, rear, lip].forEach((m) => {
        m.castShadow = true;
        m.receiveShadow = true;
        monitor.add(m);
    });

    // Bottom bezel details
    const badge = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.4),
        new THREE.MeshBasicMaterial({
            map: canvasTexture(300, 80, (g, w, h) => {
                g.fillStyle = '#b9b095';
                g.fillRect(0, 0, w, h);
                g.fillStyle = '#3b3a33';
                g.font = '52px VT323, monospace';
                g.textAlign = 'center';
                g.fillText('SK-486  CS', w / 2, 56);
            }),
        }),
    );
    badge.position.set(-1.9, 1.35, 0.805);
    monitor.add(badge);

    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.04), new THREE.MeshStandardMaterial({ color: 0x1b1b19 }));
    slot.position.set(-0.1, 1.35, 0.81);
    monitor.add(slot);

    const ledMat = new THREE.MeshStandardMaterial({ color: 0x113311, emissive: 0x000000, roughness: 0.4 });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), ledMat);
    led.position.set(1.1, 1.35, 0.82);
    monitor.add(led);

    const powerBtn = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.24, 0.1, 2, 0.04), beigeDark);
    powerBtn.position.set(1.55, 1.35, 0.84);
    powerBtn.castShadow = true;
    monitor.add(powerBtn);

    const note = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 0.85),
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
    note.position.set(2.5, 1.35, 0.805);
    note.rotation.z = -0.07;
    monitor.add(note);

    // ---------- Keyboard + mouse ----------
    const keyboard = new THREE.Group();
    keyboard.position.set(0, 0, 4.1);
    const kbBase = new THREE.Mesh(new RoundedBoxGeometry(5.4, 0.22, 2.0, 3, 0.08), beige);
    kbBase.position.y = 0.11;
    kbBase.castShadow = true;
    kbBase.receiveShadow = true;
    keyboard.add(kbBase);

    const keyGeo = new RoundedBoxGeometry(0.3, 0.14, 0.3, 2, 0.04);
    const keys = new THREE.InstancedMesh(keyGeo, new THREE.MeshStandardMaterial({ color: 0xece6d0, roughness: 0.6 }), 4 * 14);
    const m4 = new THREE.Matrix4();
    let ki = 0;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 14; c++) {
            m4.setPosition(-2.31 + c * 0.355, 0.27, -0.7 + r * 0.36);
            keys.setMatrixAt(ki++, m4);
        }
    }
    keys.castShadow = true;
    keyboard.add(keys);
    const space = new THREE.Mesh(new RoundedBoxGeometry(2.6, 0.14, 0.3, 2, 0.04), new THREE.MeshStandardMaterial({ color: 0xece6d0, roughness: 0.6 }));
    space.position.set(0, 0.27, 0.74);
    space.castShadow = true;
    keyboard.add(space);
    scene.add(keyboard);

    const pad = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.06, 2.0, 2, 0.02), new THREE.MeshStandardMaterial({ color: 0x0c4a4c, roughness: 0.95 }));
    pad.position.set(5.2, 0.03, 4.0);
    pad.receiveShadow = true;
    scene.add(pad);
    const mouse = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), beige);
    mouse.scale.set(0.38, 0.2, 0.58);
    mouse.position.set(5.2, 0.2, 4.1);
    mouse.castShadow = true;
    scene.add(mouse);
    const cable = new THREE.Mesh(
        new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(5.2, 0.12, 3.6),
                new THREE.Vector3(5.0, 0.05, 2.2),
                new THREE.Vector3(3.9, 0.05, 0.6),
                new THREE.Vector3(3.2, 0.05, -1.2),
                new THREE.Vector3(2.0, 0.05, -2.6),
            ]),
            40, 0.04, 6, false,
        ),
        new THREE.MeshStandardMaterial({ color: 0xbdb59b, roughness: 0.8 }),
    );
    cable.castShadow = true;
    scene.add(cable);

    // ---------- Props: coffee mug, floppy disks ----------
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.35, side: THREE.DoubleSide });
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
    mug.position.set(-5.4, 0, 3.0);
    scene.add(mug);

    const steamTex = canvasTexture(64, 64, (g) => {
        const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
    });
    const steam = [0, 1, 2].map((i) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false }));
        s.userData.phase = i / 3;
        mug.add(s);
        return s;
    });

    const disks = [
        { color: 0x1f3a93, label: 'PROJECTS', x: -4.2, z: 4.7, y: 0.03, r: 0.25 },
        { color: 0xb3262e, label: '', x: -4.15, z: 4.68, y: 0.085, r: -0.12 },
        { color: 0x0f8a8a, label: 'SKILLS', x: -4.18, z: 4.7, y: 0.14, r: 0.5 },
    ];
    disks.forEach((d) => {
        const f = floppy(d.color, d.label);
        f.position.set(d.x, d.y, d.z);
        f.rotation.y = d.r;
        scene.add(f);
    });

    // ---------- The screen (DOM) ----------
    const screenObj = new CSS3DObject(screenEl);
    const s = SCREEN_UNITS_W / SCREEN_PX_W;
    screenObj.scale.set(s, s, s);
    screenObj.position.set(0, SCREEN_Y, SCREEN_Z);
    scene.add(screenObj);
    screenEl.style.userSelect = 'text'; // CSS3DObject disables selection by default

    // ---------- Camera ----------
    const deskPos = new THREE.Vector3();
    const deskLook = new THREE.Vector3(0, 2.3, 0);
    const zoomPos = new THREE.Vector3();
    const zoomLook = new THREE.Vector3(0, SCREEN_Y, SCREEN_Z);
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
        // Desk view: keep the mug and mouse in frame on narrow windows
        deskPos.set(0, 5.2, Math.max(15, 8 / (tanHalf * aspect)));
        // Zoom view: fit the 4x3 screen with a small margin
        const fit = Math.max(1.5, 2 / aspect) / tanHalf;
        zoomPos.set(0, SCREEN_Y, SCREEN_Z + fit * 1.14);
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

        glow.intensity += ((powered ? 14 : 0) - glow.intensity) * Math.min(1, dt * 3);

        if (!reduce) {
            const time = now / 1000;
            steam.forEach((sp) => {
                const p = (time * 0.25 + sp.userData.phase) % 1;
                sp.position.set(Math.sin(time + sp.userData.phase * 6) * 0.08, 0.9 + p * 1.1, 0);
                sp.scale.setScalar(0.25 + p * 0.5);
                sp.material.opacity = 0.22 * Math.sin(p * Math.PI);
            });
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
