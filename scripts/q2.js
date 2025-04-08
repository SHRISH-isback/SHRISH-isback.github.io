// Function to get the readable type of HTML object
function getElementType(target) {
    const tag = target.tagName.toLowerCase();

    if (tag === 'img') return 'image';
    if (tag === 'select') return 'drop-down';
    if (tag === 'input') return 'input field';
    if (tag === 'button') return 'button';
    if (['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return 'text';
    
    return tag; // fallback to tag name
}

// Log page view
window.addEventListener('load', () => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} , view , document`);
});

// Log all clicks on the page
document.addEventListener('click', (event) => {
    const timestamp = new Date().toISOString();
    const elementType = getElementType(event.target);
    console.log(`${timestamp} , click , ${elementType}`);
});
