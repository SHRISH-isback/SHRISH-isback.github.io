// Entry point: decides between the 3D desk and the flat fallback, and wires up the controls.

import { createOS } from './os.js';

const stage = document.getElementById('stage');
const screenEl = document.getElementById('screen');
const osRoot = document.getElementById('os');
const powerBtn = document.getElementById('powerBtn');
const backBtn = document.getElementById('backBtn');

let desk = null;
let flat = false;
let zoomed = false;

function hasWebGL() {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
        return false;
    }
}

const os = createOS({
    screen: screenEl,
    isFlat: () => flat,
    onShutdown: () => leaveScreen(),
    onPowerChange: (on) => {
        desk?.setPowered(on);
        updateUI();
    },
});

function updateUI() {
    document.body.classList.toggle('is-zoomed', zoomed);
    osRoot.inert = !(zoomed || flat); // OS can't be clicked or tabbed into while the camera is away
    backBtn.hidden = !zoomed || flat;
    powerBtn.textContent = os.isOn() ? 'Enter the screen' : 'Power on';
}

function enterScreen() {
    if (zoomed) return;
    zoomed = true;
    desk?.setZoom(true);
    updateUI();
    if (!os.isOn()) os.powerOn();
    else screenEl.querySelector('.window.active, .icon')?.focus({ preventScroll: true });
}

function leaveScreen() {
    if (!zoomed || flat) return;
    zoomed = false;
    desk?.setZoom(false);
    updateUI();
    powerBtn.focus({ preventScroll: true });
}

powerBtn.addEventListener('click', enterScreen);
backBtn.addEventListener('click', leaveScreen);

// Clicking the monitor in the desk view zooms in; clicking a switched-off flat screen powers it on
screenEl.addEventListener('click', () => {
    if (!flat && !zoomed) enterScreen();
    else if (!os.isOn()) os.powerOn();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !e.defaultPrevented) leaveScreen();
});

async function start() {
    flat = matchMedia('(max-width: 760px)').matches || !hasWebGL();

    if (!flat) {
        try {
            const { initDesk } = await import('./desk.js');
            desk = await initDesk({ stage, screenEl });
        } catch (err) {
            console.warn('3D desk unavailable, using the flat layout instead.', err);
            stage.querySelectorAll('canvas, .css-layer').forEach((n) => n.remove());
            stage.append(screenEl);
            desk = null;
            flat = true;
        }
    }

    document.body.classList.toggle('flat', flat);
    document.body.classList.add('ready');
    updateUI();

    if (flat) {
        zoomed = true;
        updateUI();
        os.powerOn();
    }
}

start();
