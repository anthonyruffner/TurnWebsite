# How to View Your Website

I've started a local web server for you. Here's how to view your website:

## Option 1: Using the Running Server (Easiest)

A local server is already running. Simply:

1. Open your web browser (Chrome, Safari, Firefox, etc.)
2. Go to: **http://localhost:8000**
3. Your website should display!

## Option 2: Start Your Own Server

If the server isn't running, open Terminal and run:

```bash
cd /Users/brynne/Turn
npm start
```

Or if using pnpm:
```bash
cd /Users/brynne/Turn
pnpm start
```

Then visit: **http://localhost:8000** in your browser

**Note:** Make sure you've installed dependencies first with `npm install` (or `pnpm install`)

## Option 3: Open Directly (May have limitations)

1. Open Finder
2. Navigate to `/Users/brynne/Turn`
3. Double-click `index.html`
4. It should open in your default browser

**Note:** Opening directly may have some limitations. Using a local server (Option 1 or 2) is recommended.

## Troubleshooting

If you see a blank page:
- Make sure all files (index.html, styles.css, script.js) are in the same folder
- Check the browser console for errors (Press F12 or Cmd+Option+I)
- Try refreshing the page (Cmd+R or F5)
- Make sure you're using http://localhost:8000 (not file://)

If the server isn't running:
- The server may have stopped
- Restart it using Option 2 above

