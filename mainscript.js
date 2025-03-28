document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("darkModeToggle");
    toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        toggleBtn.classList.toggle("active");
    });

    // Typing Effect for Introduction
    const introText = "Hi, my name is Shrish Kadam. I was born in Thane on 22nd October 2006. I spent my early childhood in Mumbai until I completed 1st grade. After that, I moved to Pune, where I have been living ever since.";
    let index = 0;
    const introElement = document.getElementById("intro-text");

    function typeText() {
        if (index < introText.length) {
            introElement.innerHTML += introText.charAt(index);
            index++;
            setTimeout(typeText, 50);
        }
    }
    typeText();

    const skillBars = document.querySelectorAll(".skill-bar span");
    skillBars.forEach(bar => {
        setTimeout(() => {
            bar.style.width = bar.getAttribute("style").split(":")[1];
        }, 500);
    });

    // Generate Floating Particles
    const particlesContainer = document.querySelector(".particles-container");
    for (let i = 0; i < 20; i++) {
        let particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particlesContainer.appendChild(particle);
    }
    let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let molecules = [];
let geometry = new THREE.SphereGeometry(0.2, 32, 32);
let material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

function createDNA() {
    for (let i = 0; i < 100; i++) {
        let angle = i * 0.2;
        let x = Math.sin(angle) * 2;
        let y = i * 0.1 - 5;
        let z = Math.cos(angle) * 2;

        let ball1 = new THREE.Mesh(geometry, material1);
        ball1.position.set(x, y, z);
        scene.add(ball1);

        let ball2 = new THREE.Mesh(geometry, material2);
        ball2.position.set(-x, y, -z);
        scene.add(ball2);

        molecules.push(ball1, ball2);
    }
}

createDNA();
camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);
    molecules.forEach((mol, i) => {
        mol.position.y += Math.sin(i * 0.1 + performance.now() * 0.002) * 0.01;
    });
    scene.rotation.y += 0.005; // Rotate the entire scene
    renderer.render(scene, camera);
}

animate();

});
