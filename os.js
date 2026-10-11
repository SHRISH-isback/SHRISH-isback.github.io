// ShrishOS 95: the retro "operating system" that runs on the 3D monitor.
// It is plain DOM (no 3D code), so it also works as a flat full-screen page.

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// ------------------------------------------------------------
// Content
// ------------------------------------------------------------
const EMAIL = 'kadam.shrishk@gmail.com';
const GITHUB = 'https://github.com/SHRISH-isback';
const LINKEDIN = 'https://linkedin.com/in/shrish-kadam-isback';

const BIO = [
    "I'm a Computer Science undergraduate at IIIT Hyderabad with strong fundamentals in systems programming, algorithms, and software engineering. My work focuses on machine learning and security: two fields that demand precision, deep understanding, and hands-on problem-solving.",
    "I've built systems from the ground up, from implementing custom OS schedulers in xv6 to training NLP models for code-mixed text. I approach problems methodically, enjoy debugging at the system level, and value writing clean, maintainable code.",
    "Currently seeking opportunities to apply my skills in real-world contexts, whether that's through internships, research projects, or challenging technical problems that require both theoretical knowledge and practical execution.",
];

const SKILLS = [
    { name: 'Programming Languages', items: ['Python', 'C', 'C++', 'SQL', 'LaTeX', 'Assembly'] },
    { name: 'Machine Learning', items: ['TensorFlow', 'PyTorch', 'NLP', 'BPE Tokenization'] },
    { name: 'Cybersecurity', items: ['Buffer Overflow', 'Reverse Engineering', 'Web Exploitation'] },
    { name: 'Tools & Databases', items: ['Git', 'Docker', 'MongoDB', 'MySQL', 'Overleaf'] },
];

const PROJECTS = [
    {
        label: 'MachineCode.dsk',
        title: 'Unified Detection of Machine-Generated Code',
        tags: ['NLP', 'GraphCodeBERT', 'Ensemble Learning', 'SemEval-2026'],
        problem: 'The rise of generative models has made it increasingly difficult to distinguish machine-generated code from human-written code across diverse frameworks.',
        solution: 'Addressed SemEval-2026 Task 13 by building structural detection pipelines using structure-aware pre-trained GraphCodeBERT models.',
        impact: 'Achieved high cross-domain code validation robustness across unobserved developer architectures.',
        code: GITHUB,
    },
    {
        label: 'InsightGuard.dsk',
        title: 'InsightGuard: Real-Time Credibility Analysis',
        tags: ['Web Application', 'AI', 'SEBI Safe Space'],
        problem: 'Retail investors are highly vulnerable to fraudulent or misleading corporate announcements.',
        solution: 'Leveraged a hybrid AI processing infrastructure layer to screen corporate notifications in alignment with SEBI regulations.',
        impact: 'Mitigates micro-cap equity market manipulation via real-time risk assessment flags.',
        code: GITHUB,
    },
    {
        label: 'PhishGuard.dsk',
        title: 'PhishGuard - Phishing URL Detector',
        tags: ['Web Application', 'Machine Learning', 'Security'],
        problem: 'Social engineering threat variants manipulate uniform resource locators (URLs) to compromise consumer keys.',
        solution: 'Compiled deep tensor training models optimized to screen semantic link paths synchronously.',
        impact: 'Lowers individual surface exploitation boundaries via continuous domain screening metrics.',
        code: GITHUB,
    },
    {
        label: 'NetFS.dsk',
        title: 'Network File System',
        tags: ['C', 'Networking', 'Systems'],
        problem: 'Sharing files efficiently across multiple machines requires a robust distributed file system design.',
        solution: 'Designed and implemented a network file system supporting remote file access, consistency, and fault tolerance.',
        impact: 'Enabled seamless file sharing and concurrent request allocations across sandboxed network layers.',
        code: GITHUB,
    },
    {
        label: 'Shell.dsk',
        title: 'Custom Shell Implementation',
        tags: ['C', 'Systems', 'Unix'],
        problem: 'Standard native kernels obscure the logical processing mechanisms involved in OS sub-allocations.',
        solution: 'Engineered a low-level POSIX execution shell feature engine with modular process controls and token piping pipelines.',
        impact: 'Provides isolated job pipeline tracking with custom environment management capabilities.',
        code: GITHUB,
    },
];

const BOOT_LINES = [
    ['SK-BIOS v1.0  (C) 2026 Shrish Kiran Kadam', '', 260],
    ['', '', 120],
    ['CPU ........ B.Tech CS, IIIT Hyderabad', '', 220],
    ['Memory ..... 65536K', ' OK', 260],
    ['Detecting drives...', '', 260],
    ['  A: projects.dsk', '   OK', 160],
    ['  C: knowledge.img', '  OK', 160],
    ['', '', 120],
    ['Loading ML.SYS ........', ' OK', 230],
    ['Loading SECURITY.SYS ..', ' OK', 230],
    ['Loading SYSTEMS.SYS ...', ' OK', 230],
    ['', '', 160],
    ['Starting ShrishOS 95...', '', 500],
];

// ------------------------------------------------------------
// Pixel-style icons (decorative, so aria-hidden)
// ------------------------------------------------------------
const svg = (inner) => `<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${inner}</svg>`;
const ICONS = {
    terminal: svg('<rect x="2" y="4" width="28" height="24" fill="#c0c0c0"/><rect x="2" y="4" width="28" height="3" fill="#000080"/><rect x="4" y="9" width="24" height="17" fill="#000"/><rect x="6" y="12" width="2" height="2" fill="#55ff55"/><rect x="8" y="14" width="2" height="2" fill="#55ff55"/><rect x="6" y="16" width="2" height="2" fill="#55ff55"/><rect x="12" y="18" width="8" height="2" fill="#c0c0c0"/>'),
    folder: svg('<rect x="2" y="7" width="12" height="5" fill="#b38f00"/><rect x="2" y="11" width="28" height="17" fill="#ffd23f"/><rect x="2" y="11" width="28" height="2" fill="#fff0a0"/><rect x="2" y="26" width="28" height="2" fill="#b38f00"/>'),
    floppy: svg('<rect x="3" y="3" width="26" height="26" fill="#2a3c8f"/><rect x="9" y="3" width="14" height="9" fill="#c0c0c0"/><rect x="18" y="5" width="3" height="5" fill="#2a3c8f"/><rect x="7" y="17" width="18" height="12" fill="#fff"/><rect x="9" y="20" width="14" height="1" fill="#808080"/><rect x="9" y="23" width="10" height="1" fill="#808080"/>'),
    cap: svg('<polygon points="16,6 30,13 16,20 2,13" fill="#111"/><polygon points="8,17 8,24 16,28 24,24 24,17 16,21" fill="#444"/><rect x="28" y="13" width="1" height="10" fill="#ffd23f"/><rect x="27" y="22" width="3" height="4" fill="#ffd23f"/>'),
    mail: svg('<rect x="3" y="7" width="26" height="18" fill="#fff" stroke="#000"/><polyline points="3,7 16,18 29,7" fill="none" stroke="#000080" stroke-width="2"/>'),
    doc: svg('<rect x="7" y="3" width="18" height="26" fill="#fff" stroke="#000"/><rect x="10" y="9" width="12" height="2" fill="#808080"/><rect x="10" y="14" width="12" height="2" fill="#808080"/><rect x="10" y="19" width="8" height="2" fill="#808080"/>'),
    power: svg('<circle cx="16" cy="17" r="9" fill="none" stroke="#c00" stroke-width="3"/><rect x="14" y="4" width="4" height="12" fill="#c00" stroke="#c0c0c0" stroke-width="2"/>'),
    github: svg('<circle cx="16" cy="16" r="12" fill="#111"/><circle cx="16" cy="16" r="5" fill="#c0c0c0"/>'),
    link: svg('<rect x="3" y="3" width="26" height="26" fill="#0a66c2"/><rect x="8" y="13" width="3" height="11" fill="#fff"/><rect x="8" y="8" width="3" height="3" fill="#fff"/><rect x="14" y="13" width="3" height="11" fill="#fff"/><rect x="17" y="13" width="7" height="3" fill="#fff"/><rect x="21" y="16" width="3" height="8" fill="#fff"/>'),
};

// ------------------------------------------------------------
// Apps: each render() fills the window body and may return a cleanup function
// ------------------------------------------------------------
const APPS = {
    about: { label: 'About', title: 'Terminal - about.txt', icon: 'terminal', size: [560, 380], render: renderAbout },
    skills: { label: 'Skills', title: 'Skills', icon: 'folder', size: [580, 380], render: renderSkills },
    projects: { label: 'Projects', title: 'Projects - A:\\', icon: 'floppy', size: [640, 440], render: renderProjects },
    education: { label: 'Education', title: 'transcript.exe', icon: 'cap', size: [500, 350], render: renderEducation },
    contact: { label: 'Contact', title: 'New Message', icon: 'mail', size: [540, 400], render: renderContact },
};

function renderAbout(body) {
    const steps = [
        { cmd: 'whoami' },
        { out: 'shrish_kiran_kadam\nB.Tech Computer Science @ IIIT Hyderabad\nFocus: Machine Learning, Cybersecurity, Systems' },
        { cmd: 'cat about.txt' },
        ...BIO.map((out) => ({ out })),
    ];
    const fullText = steps.map((s) => (s.cmd ? `C:\\SHRISH> ${s.cmd}` : s.out)).join('\n\n');

    body.innerHTML = `
        <div class="about">
            <figure class="about-photo" style="margin:0">
                <img src="Profilepicture.png" alt="Portrait of Shrish Kiran Kadam">
                <figcaption>photo.bmp</figcaption>
            </figure>
            <div class="term" tabindex="0" role="region" aria-label="About me terminal. Click to skip the typing animation.">
                <div class="sr-only">${esc(fullText)}</div>
                <div class="term-out" aria-hidden="true"></div>
            </div>
        </div>`;

    const term = body.querySelector('.term');
    const out = body.querySelector('.term-out');
    const caret = document.createElement('span');
    caret.className = 'caret';

    let alive = true;
    let skip = reduceMotion();
    term.addEventListener('click', () => { skip = true; });

    const scroll = () => { term.scrollTop = term.scrollHeight; };

    (async () => {
        for (const step of steps) {
            if (!alive) return;
            if (step.cmd !== undefined) {
                const line = document.createElement('div');
                line.innerHTML = '<span class="prompt">C:\\SHRISH&gt;</span> ';
                const text = document.createTextNode('');
                line.append(text);
                out.append(line);
                for (const ch of step.cmd) {
                    text.data += ch;
                    line.append(caret);
                    if (!skip) await sleep(45);
                    if (!alive) return;
                }
                if (!skip) await sleep(250);
            } else {
                const block = document.createElement('div');
                block.className = 'term-line';
                out.append(block);
                const text = step.out;
                for (let i = 0; i < text.length; i += 3) {
                    block.textContent = text.slice(0, i + 3);
                    block.append(caret);
                    scroll();
                    if (!skip) await sleep(12);
                    if (!alive) return;
                }
                block.textContent = text;
            }
        }
        const last = document.createElement('div');
        last.innerHTML = '<span class="prompt">C:\\SHRISH&gt;</span> ';
        last.append(caret);
        out.append(last);
        scroll();
    })();

    return () => { alive = false; };
}

function renderSkills(body) {
    body.innerHTML = `
        <div class="explorer">
            <div class="addr"><span>Address</span><div class="path" id="skillPath"></div></div>
            <div class="panes">
                <ul class="tree" aria-label="Skill categories">
                    ${SKILLS.map((s, i) => `<li><button type="button" data-i="${i}">${ICONS.folder}<span>${esc(s.name)}</span></button></li>`).join('')}
                </ul>
                <div class="files" aria-live="polite"></div>
            </div>
            <div class="statusbar"></div>
        </div>`;

    const buttons = [...body.querySelectorAll('.tree button')];
    const files = body.querySelector('.files');
    const path = body.querySelector('.path');
    const status = body.querySelector('.statusbar');

    const select = (i) => {
        const cat = SKILLS[i];
        buttons.forEach((b, j) => b.setAttribute('aria-current', String(i === j)));
        path.textContent = `C:\\Skills\\${cat.name}`;
        files.innerHTML = cat.items.map((n) => `<div class="file">${ICONS.doc}<span>${esc(n)}</span></div>`).join('');
        status.textContent = `${cat.items.length} object(s)`;
    };
    buttons.forEach((b) => b.addEventListener('click', () => select(Number(b.dataset.i))));
    select(0);
}

function renderProjects(body) {
    body.innerHTML = `
        <div class="proj">
            <ul class="proj-list" aria-label="Project disks">
                ${PROJECTS.map((p, i) => `<li><button type="button" data-i="${i}">${ICONS.floppy}<span>${esc(p.label)}</span></button></li>`).join('')}
            </ul>
            <div class="proj-detail" aria-live="polite"></div>
        </div>`;

    const buttons = [...body.querySelectorAll('.proj-list button')];
    const detail = body.querySelector('.proj-detail');

    const select = (i) => {
        const p = PROJECTS[i];
        buttons.forEach((b, j) => b.setAttribute('aria-current', String(i === j)));
        detail.innerHTML = `
            <h3>${esc(p.title)}</h3>
            <ul class="tags">${p.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
            <dl>
                <dt>Problem</dt><dd>${esc(p.problem)}</dd>
                <dt>Solution</dt><dd>${esc(p.solution)}</dd>
                <dt>Impact</dt><dd>${esc(p.impact)}</dd>
            </dl>
            <a class="btn" href="${esc(p.code)}" target="_blank" rel="noopener noreferrer">${ICONS.github} View code</a>`;
    };
    buttons.forEach((b) => b.addEventListener('click', () => select(Number(b.dataset.i))));
    select(0);
}

function renderEducation(body) {
    body.innerHTML = `
        <div class="cert">
            <p class="kicker">DEGREE PROGRAM</p>
            <h3>Bachelor of Technology in Computer Science</h3>
            <p class="school">International Institute of Information Technology, Hyderabad</p>
            <p class="years">2024 - 2029 (Expected)</p>
            <div class="progress" role="img" aria-label="Status: in progress"><i></i></div>
            <p class="focus">Status: installing knowledge... Focus areas: Machine Learning, Cybersecurity, Systems</p>
        </div>`;
}

function renderContact(body) {
    body.innerHTML = `
        <form class="mail">
            <div class="field"><label for="mailName">From</label><input id="mailName" name="name" type="text" autocomplete="name" placeholder="Your name" required></div>
            <div class="field"><label for="mailSubject">Subject</label><input id="mailSubject" name="subject" type="text" value="Hello from your portfolio" required></div>
            <div class="field"><label for="mailMsg">Message</label><textarea id="mailMsg" name="msg" rows="6" required></textarea></div>
            <div class="mail-actions">
                <button class="btn" type="submit">${ICONS.mail} Send</button>
                <p class="mail-note" role="status"></p>
            </div>
            <div class="links">
                <a class="btn" href="mailto:${EMAIL}">${ICONS.mail} Email</a>
                <a class="btn" href="${GITHUB}" target="_blank" rel="noopener noreferrer">${ICONS.github} GitHub</a>
                <a class="btn" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">${ICONS.link} LinkedIn</a>
            </div>
        </form>`;

    const form = body.querySelector('form');
    const note = body.querySelector('.mail-note');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(form);
        const text = `${f.get('msg')}\n\n- ${f.get('name')}`;
        const url = `mailto:${EMAIL}?subject=${encodeURIComponent(f.get('subject'))}&body=${encodeURIComponent(text)}`;
        note.textContent = 'Opening your mail app...';
        window.location.href = url;
    });
}

// ------------------------------------------------------------
// The OS itself
// ------------------------------------------------------------
export function createOS({ screen, isFlat = () => false, onShutdown = () => {}, onPowerChange = () => {} }) {
    const $ = (sel) => screen.querySelector(sel);
    const bootEl = $('#boot');
    const desktop = $('#desktop');
    const iconsEl = $('#icons');
    const taskbar = $('#taskbar');
    const tasksEl = $('#tasks');
    const startBtn = $('#startBtn');
    const startMenu = $('#startMenu');
    const clock = $('#clock');

    const wins = new Map(); // app id -> { el, task, cleanup }
    let zTop = 10;
    let on = false;
    let run = 0; // incremented on reset so stale boot sequences stop
    let clockTimer = null;

    // Desktop icons
    iconsEl.innerHTML = Object.entries(APPS)
        .map(([id, a]) => `<button type="button" class="icon" data-app="${id}">${ICONS[a.icon]}<span>${a.label}</span></button>`)
        .join('');
    iconsEl.addEventListener('click', (e) => {
        const b = e.target.closest('[data-app]');
        if (b) openApp(b.dataset.app);
    });

    // Start menu
    startMenu.innerHTML = `
        <div class="side" aria-hidden="true">ShrishOS 95</div>
        <ul>
            ${Object.entries(APPS).map(([id, a]) => `<li><button type="button" data-app="${id}">${ICONS[a.icon]}${a.label}</button></li>`).join('')}
            <li><hr></li>
            <li><button type="button" data-shutdown>${ICONS.power}Shut Down...</button></li>
        </ul>`;
    startMenu.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        closeMenu();
        if (b.dataset.app) openApp(b.dataset.app);
        else if (b.hasAttribute('data-shutdown')) shutdown();
    });
    startBtn.addEventListener('click', () => (startMenu.hidden ? openMenu() : closeMenu()));
    screen.addEventListener('pointerdown', (e) => {
        if (!startMenu.hidden && !e.target.closest('#startMenu, #startBtn')) closeMenu();
    });
    screen.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !startMenu.hidden) {
            e.preventDefault(); // tells main.js not to leave the screen as well
            closeMenu();
            startBtn.focus();
        }
    });

    function openMenu() {
        startMenu.hidden = false;
        startBtn.setAttribute('aria-expanded', 'true');
        startMenu.querySelector('button')?.focus();
    }
    function closeMenu() {
        startMenu.hidden = true;
        startBtn.setAttribute('aria-expanded', 'false');
    }

    // Windows
    function openApp(id) {
        const existing = wins.get(id);
        if (existing) {
            existing.el.classList.remove('min');
            focusWin(id);
            return;
        }
        const app = APPS[id];
        const [w, h] = app.size;
        const n = wins.size;
        const el = document.createElement('section');
        el.className = 'window';
        el.tabIndex = -1;
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', app.title);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.left = `${Math.min(112 + n * 26, 800 - w - 6)}px`;
        el.style.top = `${Math.min(12 + n * 26, 564 - h - 6)}px`;
        el.innerHTML = `
            <header class="titlebar">
                <span class="tb-icon">${ICONS[app.icon]}</span>
                <h2 class="tb-title">${esc(app.title)}</h2>
                <div class="tb-btns">
                    <button class="tb-btn" type="button" data-act="min" aria-label="Minimize ${esc(app.label)}">_</button>
                    <button class="tb-btn" type="button" data-act="close" aria-label="Close ${esc(app.label)}">&times;</button>
                </div>
            </header>
            <div class="win-body"></div>`;
        desktop.append(el);

        const task = document.createElement('button');
        task.type = 'button';
        task.className = 'btn task';
        task.textContent = app.label;
        task.addEventListener('click', () => {
            const rec = wins.get(id);
            if (!rec) return;
            if (!rec.el.classList.contains('min') && rec.el.classList.contains('active')) {
                rec.el.classList.add('min');
                task.setAttribute('aria-pressed', 'false');
            } else {
                rec.el.classList.remove('min');
                focusWin(id);
            }
        });
        tasksEl.append(task);

        const cleanup = app.render(el.querySelector('.win-body'));
        wins.set(id, { el, task, cleanup });

        el.addEventListener('pointerdown', () => focusWin(id));
        el.querySelector('[data-act="close"]').addEventListener('click', () => closeWin(id));
        el.querySelector('[data-act="min"]').addEventListener('click', () => {
            el.classList.add('min');
            task.setAttribute('aria-pressed', 'false');
            el.classList.remove('active');
            iconsEl.querySelector(`[data-app="${id}"]`)?.focus();
        });
        enableDrag(el, el.querySelector('.titlebar'));
        focusWin(id);
    }

    function focusWin(id) {
        wins.forEach((rec, key) => {
            const active = key === id;
            rec.el.classList.toggle('active', active);
            rec.task.setAttribute('aria-pressed', String(active));
        });
        const rec = wins.get(id);
        rec.el.style.zIndex = String(++zTop);
        rec.el.focus({ preventScroll: true });
    }

    function closeWin(id) {
        const rec = wins.get(id);
        if (!rec) return;
        rec.cleanup?.();
        rec.el.remove();
        rec.task.remove();
        wins.delete(id);
        iconsEl.querySelector(`[data-app="${id}"]`)?.focus();
    }

    function enableDrag(el, handle) {
        handle.addEventListener('pointerdown', (e) => {
            if (isFlat() || e.target.closest('.tb-btn')) return;
            // The screen is drawn with a 3D transform, so convert pointer pixels to screen pixels
            const scale = screen.getBoundingClientRect().width / screen.offsetWidth || 1;
            const startX = e.clientX, startY = e.clientY;
            const ox = el.offsetLeft, oy = el.offsetTop;
            handle.setPointerCapture(e.pointerId);
            const move = (ev) => {
                const x = ox + (ev.clientX - startX) / scale;
                const y = oy + (ev.clientY - startY) / scale;
                el.style.left = `${Math.max(-el.offsetWidth + 90, Math.min(x, desktop.clientWidth - 90))}px`;
                el.style.top = `${Math.max(0, Math.min(y, desktop.clientHeight - 24))}px`;
            };
            const up = () => {
                handle.removeEventListener('pointermove', move);
                handle.removeEventListener('pointerup', up);
                handle.removeEventListener('pointercancel', up);
            };
            handle.addEventListener('pointermove', move);
            handle.addEventListener('pointerup', up);
            handle.addEventListener('pointercancel', up);
        });
    }

    // Power
    const showClock = () => {
        clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    async function powerOn() {
        if (on) return;
        on = true;
        const id = ++run;
        onPowerChange(true);
        screen.classList.remove('is-off');
        desktop.hidden = true;
        taskbar.hidden = true;
        bootEl.className = 'boot';
        bootEl.textContent = '';
        bootEl.hidden = false;

        let skipped = reduceMotion();
        const skip = () => { skipped = true; };
        document.addEventListener('keydown', skip);
        screen.addEventListener('pointerdown', skip);

        for (const [text, tail, delay] of BOOT_LINES) {
            const line = document.createElement('div');
            line.append(text);
            if (tail) {
                const ok = document.createElement('span');
                ok.className = 'ok';
                ok.textContent = tail;
                line.append(ok);
            }
            bootEl.append(line);
            if (!skipped) await sleep(delay);
            if (id !== run) return;
        }
        if (!skipped) await sleep(500);
        document.removeEventListener('keydown', skip);
        screen.removeEventListener('pointerdown', skip);
        if (id !== run) return;

        desktop.hidden = false;
        taskbar.hidden = false;
        showClock();
        clockTimer = setInterval(showClock, 20000);
        bootEl.classList.add('hide');
        if (!skipped) await sleep(600);
        if (id !== run) return;
        bootEl.hidden = true;
        openApp('about');
    }

    async function shutdown() {
        if (!on) return;
        const id = run;
        closeMenu();
        desktop.hidden = true;
        taskbar.hidden = true;
        bootEl.className = 'boot shutdown';
        bootEl.innerHTML = '<div class="amber">It\'s now safe to turn off<br>your computer.</div>';
        bootEl.hidden = false;
        await sleep(reduceMotion() ? 600 : 1300);
        if (id !== run) return;
        onShutdown(); // main.js starts zooming the camera back out
        await sleep(reduceMotion() ? 0 : 900);
        if (id !== run) return;
        reset();
    }

    function reset() {
        run++;
        clearInterval(clockTimer);
        [...wins.keys()].forEach((id) => {
            const rec = wins.get(id);
            rec.cleanup?.();
            rec.el.remove();
            rec.task.remove();
            wins.delete(id);
        });
        closeMenu();
        desktop.hidden = true;
        taskbar.hidden = true;
        bootEl.hidden = true;
        screen.classList.add('is-off');
        on = false;
        onPowerChange(false);
    }

    return { powerOn, isOn: () => on };
}
