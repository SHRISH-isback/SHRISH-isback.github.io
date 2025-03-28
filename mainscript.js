document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "index.html" || currentPage === "about.html" || currentPage === "") {
        const particleCanvas = document.createElement("canvas");
        particleCanvas.id = "particleCanvas"; 
        document.body.prepend(particleCanvas);
        const pCtx = particleCanvas.getContext("2d");

        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const particles = [];
        const numParticles = 150; 

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                alpha: Math.random() * 0.5 + 0.5
            });
        }

        function drawParticles() {
            pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            pCtx.fillStyle = "rgba(255, 69, 0, 0.7)";
            pCtx.shadowBlur = 10;
            pCtx.shadowColor = "rgba(255, 69, 0, 0.7)";

            for (let particle of particles) {
                pCtx.beginPath();
                pCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                pCtx.fill();
            }
        }

        let mouse = { x: null, y: null, radius: 100 };

        window.addEventListener("mousemove", function (event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        function updateParticles() {
            for (let particle of particles) {
                let dx = mouse.x - particle.x;
                let dy = mouse.y - particle.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let forceX = dx / distance;
                    let forceY = dy / distance;
                    particle.x -= forceX * 5;
                    particle.y -= forceY * 5;
                }

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > particleCanvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > particleCanvas.height) particle.speedY *= -1;
            }
        }

        window.addEventListener("click", function (event) {
            for (let i = 0; i < 5; i++) { 
                particles.push({
                    x: event.x,
                    y: event.y,
                    size: Math.random() * 5 + 2,
                    speedX: (Math.random() - 0.5) * 4,
                    speedY: (Math.random() - 0.5) * 4,
                    alpha: 1
                });
            }
        });

        function animateParticles() {
            drawParticles();
            updateParticles();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        particleCanvas.style.position = "fixed";
        particleCanvas.style.top = "0";
        particleCanvas.style.left = "0";
        particleCanvas.style.zIndex = "-1"; 
        particleCanvas.style.pointerEvents = "none"; 
    }
});
