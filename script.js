// Highlight the nav link for the section currently in view.

const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');

function updateActiveNavLink() {
    const position = window.scrollY + 120;
    let current = null;

    sections.forEach(section => {
        if (section.offsetTop <= position) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('load', updateActiveNavLink);
