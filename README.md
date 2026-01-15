# Shrish Kadam - Personal Website

A clean, modern, and professional personal portfolio website built with vanilla HTML, CSS, and JavaScript.

## 🎯 Overview

This is a recruiter-ready personal website designed to showcase technical competence, projects, and skills in a scannable, professional format. The design prioritizes clarity, performance, and accessibility.

## ✨ Features

- **Fully Responsive**: Mobile-first design that works seamlessly across all devices
- **Fast Loading**: Optimized for performance with minimal dependencies
- **Accessible**: WCAG-compliant with keyboard navigation support
- **SEO-Friendly**: Proper semantic HTML and meta tags
- **Clean Design**: Minimalist aesthetic with thoughtful typography and spacing
- **Smooth Animations**: Subtle hover effects and scroll animations

## 📁 Project Structure

```
profile/
├── index.html          # Main HTML file with semantic structure
├── styles.css          # Complete CSS with organized sections
├── script.js           # JavaScript for interactivity and animations
└── README.md           # This file
```

## 🛠️ Technical Stack

- **HTML5**: Semantic markup for better SEO and accessibility
- **CSS3**: Modern CSS with CSS Grid, Flexbox, and CSS Variables
- **JavaScript (ES6+)**: Vanilla JS for interactivity, no frameworks needed
- **Google Fonts**: Inter font family for clean typography

## 🚀 Deployment

### GitHub Pages

1. Create a new repository on GitHub
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Personal website"
   git branch -M main
   git remote add origin https://github.com/shrishkadam/shrishkadam.github.io.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select `main` branch as source
5. Your site will be live at `https://shrishkadam.github.io`

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts
4. Your site will be deployed with a custom URL

### Netlify

1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your Git repository for automatic deployments

## 🎨 Design Decisions

### Color Palette
- **Primary**: Indigo (#6366f1) - Professional yet modern
- **Background**: White/Light Gray - Maximum readability
- **Text**: Dark Gray (#111827) - Easy on the eyes
- **Accents**: Subtle borders and hover states

### Typography
- **Font**: Inter - Clean, professional, highly readable
- **Hierarchy**: Clear distinction between headings and body text
- **Line Height**: 1.6 for optimal readability

### Layout
- **Max Width**: 1200px - Optimal reading experience
- **Spacing**: Consistent 8px-based system
- **Grid**: CSS Grid for responsive card layouts
- **Whitespace**: Generous spacing for visual breathing room

### Interactions
- **Hover Effects**: Subtle elevation and color changes
- **Smooth Scrolling**: Enhanced navigation experience
- **Mobile Menu**: Hamburger menu for small screens
- **Fade-in Animations**: Progressive disclosure on scroll

## 📱 Responsive Breakpoints

- **Desktop**: > 768px - Full layout with multiple columns
- **Tablet**: 481px - 768px - Stacked cards, single column
- **Mobile**: < 480px - Optimized spacing and typography

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for all interactive elements
- Sufficient color contrast ratios
- Reduced motion support for users with vestibular disorders

## 🔧 Customization

### Updating Content

1. **Personal Info**: Edit the hero section in `index.html`
2. **Projects**: Modify the project cards in the projects section
3. **Skills**: Update skill categories in the skills section
4. **Contact Links**: Change email/social links in the contact section

### Changing Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --color-primary: #6366f1;
    --color-primary-dark: #4f46e5;
    /* ... other variables */
}
```

### Adding Analytics

Add your tracking code in `script.js` at the analytics placeholder section.

## 📊 Performance

- **Load Time**: < 1 second on average
- **File Size**: Minimal (HTML + CSS + JS < 50KB combined)
- **No External Dependencies**: Except Google Fonts (optional)
- **Lazy Loading**: Images and animations load progressively

## 🔒 Security

- No external JavaScript libraries (no supply chain vulnerabilities)
- Basic email obfuscation in place
- No form submissions (direct mailto links)
- HTTPS recommended for deployment

## 📝 Content Guidelines

### What Makes This Portfolio Effective

1. **Scannable**: Recruiters can understand your skills in 20-30 seconds
2. **Project-Focused**: Each project tells a story (Problem → Solution → Impact)
3. **Technical Depth**: Shows real understanding, not just buzzwords
4. **Clean Design**: Doesn't distract from the content
5. **Professional**: Appropriate for academic and industry applications

### What to Avoid

- Generic statements like "passionate developer"
- Progress bars for skills (not quantifiable)
- Too many projects (focus on best 4-6)
- Excessive animations or effects
- Stock photos or generic imagery

## 🤝 Contributing

This is a personal website, but feel free to use it as a template for your own portfolio. If you find bugs or have suggestions, feel free to reach out!

## 📄 License

This project is open source and available for personal use. Feel free to fork and modify for your own portfolio.

## 👤 Author

**Shrish Kadam**
- GitHub: [@shrishkadam](https://github.com/shrishkadam)
- LinkedIn: [shrish-kadam](https://linkedin.com/in/shrish-kadam)
- Email: shrish.kadam@students.iiit.ac.in

---

Built with attention to detail and a focus on user experience. No frameworks, no bloat, just clean code.
