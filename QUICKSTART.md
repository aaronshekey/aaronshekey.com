# Quick Start Guide

## Setup

```bash
npm install
```

## Development

Start the dev server with hot module replacement:

```bash
npm run dev
```

Visit `http://localhost:3030` in your browser.

## Building

Build for production:

```bash
npm run build
```

Output will be in the `build/` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Common Tasks

### Adding a New Page

1. Create an HTML file in `src/` (e.g., `src/new-page/index.html`)
2. Use the `include` directive to add templates:
   ```html
   <!-- prettier-ignore-start -->
   include "header.html"
   <!-- prettier-ignore-end -->
   ```
3. The page will automatically be detected and built

### Adding a New Template

1. Create an HTML file in `src/_templates/`
2. Reference it using `include "your-template.html"`
3. Templates can include other templates (nested includes work)

### Updating Styles

1. Edit `src/_/css/tailwind.css`
2. Changes will hot reload in development
3. Production builds automatically minify CSS

### Adding Images

1. Place images in `src/_/img/`
2. Reference with `/_/img/your-image.png`
3. Images are automatically copied to build

### Adding Fonts

1. Place fonts in `src/_/fonts/`
2. Reference in CSS with `url("../fonts/your-font.woff2")`
3. Fonts are automatically copied to build

## Deployment

Push to `master` branch - Netlify automatically builds and deploys.

## Troubleshooting

**Dev server won't start:**
- Delete `node_modules` and run `npm install` again

**CSS not loading:**
- Verify `src/_/css/tailwind.css` exists
- Check that templates reference `/_/css/tailwind.css`

**Includes not working:**
- Ensure template files exist in `src/_templates/`
- Use double quotes: `include "file.html"` not `include 'file.html'`

**Build fails:**
- Check for syntax errors in HTML files
- Verify all referenced templates exist
- Run `npm run build` to see detailed error messages