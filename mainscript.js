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

    // Animate Skill Bars
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
});
