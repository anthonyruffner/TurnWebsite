# Turn - Website Home Page

A modern, responsive website home page with a clean design and smooth user experience.

## Features

- 🎨 Modern, clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- 🎯 Accessible navigation
- 📝 Contact form
- 🌈 Beautiful gradient effects

## Getting Started

### Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js) or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
   
   Or if using pnpm:
   ```bash
   pnpm install
   ```

### Viewing the Website

1. **Using npm** (Recommended):
   ```bash
   npm start
   ```
   
   Then open: `http://localhost:8000` in your browser

2. **Using pnpm**:
   ```bash
   pnpm start
   ```
   
   Then open: `http://localhost:8000` in your browser

3. **Simple Method**: Open `index.html` directly in your web browser
   - Double-click the `index.html` file, or
   - Right-click and select "Open with" your preferred browser
   - Note: Some features may not work when opening directly (use a local server for best results)

## File Structure

```
Turn/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet with all styling
├── script.js       # JavaScript for interactivity
├── package.json    # npm configuration and dependencies
└── README.md       # This file
```

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... other colors ... */
}
```

### Content
- Edit the HTML content in `index.html`
- Modify text, sections, and structure as needed

### Styling
- All styles are in `styles.css`
- Responsive breakpoints are set at 768px and 480px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The contact form currently shows an alert on submit. To actually send emails, you'll need to integrate with a backend service.
- Images can be added by replacing the `.hero-placeholder` div with actual `<img>` tags.
- The navigation menu works on both desktop and mobile devices.

## License

Feel free to use and modify this template for your projects!

