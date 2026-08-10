# 🌐 Tribute Page: Brendan Eich

This project is Task 2 of Level 2 in the Web Development and Designing track for the Oasis Infobyte (OIBSIP) Internship. It is a premium, responsive tribute page dedicated to Brendan Eich, the creator of JavaScript. 

While the task only required HTML and CSS, I integrated vanilla JavaScript to deliver a highly interactive and modern user experience.

## 🚀 Live Demo
![text](https://oibsip-asud.vercel.app/WebDev-L2-TributePage/index.html)
![image](image.png)

## 🛠️ Tech Stack & Architecture
* **HTML5:** Semantic architecture utilizing modern tags (`<header>`, `<main>`, `<section>`) for maximum accessibility and SEO structure.
* **CSS3:** 
  * Features a **Glassmorphism** sticky header using `backdrop-filter`.
  * Utilizes **CSS Grid** for a fully responsive timeline that requires zero media queries.
  * Implements **CSS Custom Properties (:root)** to manage a highly scalable color palette.
* **JavaScript (Vanilla):** 
  * Manages state for a seamless Dark/Light theme toggle.
  * Utilizes `localStorage` to persist the user's theme preference across sessions.
  * Implements the `IntersectionObserver` API for highly performant scroll-reveal animations.

## ✨ Core Features
* **Dynamic Theme Switching:** Users can toggle between a high-contrast Light Theme and a premium Dark-Luxe Theme, fulfilling the requirement for multiple background colors dynamically.
* **Scroll-Reveal Animations:** Content gently fades and floats into view as the user scrolls, creating a polished, application-like feel.
* **Editorial Typography:** Pairs `Inter` (sans-serif) for high legibility with `Merriweather` (serif) for sophisticated, authoritative headings and quotes.
* **Responsive Layout:** The design adapts fluidly to all screen sizes without compromising the structural integrity of the UI.

## 📂 File Structure
* `index.html` - The structural markup.
* `style.css` - The design system, including glassmorphism and theme variables.
* `script.js` - The interactive logic (Theme Toggle & IntersectionObserver).
* `README.md` - Project documentation.
* `image.png` - The visual image of the tribute page

## 👨‍💻 Developer Notes
This project was engineered to go beyond standard static layouts. By actively avoiding deprecated scroll event listeners and utilizing `IntersectionObserver`, the page maintains 60fps scrolling performance. The dual-theme architecture demonstrates modern state management techniques using purely vanilla web technologies.