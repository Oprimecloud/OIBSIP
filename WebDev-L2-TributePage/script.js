/**
 * 1. Dark/Light Theme Toggle
 * Correctly targets the data-theme attribute on the root HTML element.
 */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const rootElement = document.documentElement; // Targets the <html> tag

// Check localStorage for saved theme, default to 'dark' if none exists
const savedTheme = localStorage.getItem('theme') || 'dark';
rootElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    // Check current theme
    const currentTheme = rootElement.getAttribute('data-theme');
    
    // Swap theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme and save
    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    if (theme === 'dark') {
        themeIcon.textContent = '☀️'; // Show sun when in dark mode
    } else {
        themeIcon.textContent = '🌙'; // Show moon when in light mode
    }
}

/**
 * 2. Scroll Reveal Animations
 * Smoothly fades in elements as they enter the viewport.
 */
const revealElements = document.querySelectorAll('.fade-in');

const revealOptions = {
    threshold: 0.1, // Triggers when 10% visible
    rootMargin: "0px 0px -50px 0px" 
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});