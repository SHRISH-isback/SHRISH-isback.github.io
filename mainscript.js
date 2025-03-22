document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("darkModeToggle");
    const blogSections = document.querySelectorAll(".blog-section");

    // Load Dark Mode Preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // Toggle Dark Mode
    toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // Blog Hover Effect
    blogSections.forEach((section) => {
        section.addEventListener("mouseenter", () => {
            blogSections.forEach((other) => {
                if (other !== section) {
                    other.classList.add("hover-effect");
                }
            });
        });

        section.addEventListener("mouseleave", () => {
            blogSections.forEach((other) => {
                other.classList.remove("hover-effect");
            });
        });
    });
});
