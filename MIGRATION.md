# Migration Guide: Grunt to Vite

This document outlines the migration from Grunt to Vite for the aaronshekey.com website.

## What Changed

### Build System
- **Before**: Grunt with multiple plugins (grunt-includes, grunt-contrib-copy, grunt-contrib-watch, etc.)
- **After**: Vite with a custom HTML includes plugin

### Development Server
- **Before**: `grunt-contrib-connect` on port 3030
- **After**: Vite dev server on port 3030

### Scripts
- **Before**: 
  - `npm start` - Build and serve with live reload
  - `npm run build` - Build for production
- **After**:
  - `npm run dev` - Start dev server with HMR
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build

### CSS Processing
- **Before**: Tailwind CLI via grunt-shell, concatenated with grunt-contrib-concat
- **After**: Vite handles CSS processing automatically with Tailwind CSS v4

### HTML Templating
- **Before**: `grunt-includes` with `include "template.html"` syntax
- **After**: Custom Vite plugin that processes the same `include "template.html"` syntax

No changes needed to HTML files - the include syntax remains identical!

### File Structure
The source structure (`src/`) remains the same. The build output (`build/`) structure is also preserved.

## What Was Removed

### Removed Dependencies
All Grunt-related packages were removed:
- grunt
- grunt-concurrent
- grunt-contrib-clean
- grunt-contrib-concat
- grunt-contrib-connect
- grunt-contrib-copy
- grunt-contrib-cssmin
- grunt-contrib-less
- grunt-contrib-watch
- grunt-includes
- grunt-postcss
- grunt-purgecss
- grunt-shell

### Added Dependencies
- vite (^5.4.11)
- glob (^11.0.0) - for finding HTML entry points

### Kept Dependencies
- @tailwindcss/cli
- @tailwindcss/typography
- tailwindcss

## Benefits of the Migration

1. **Faster Development**: Vite's dev server starts instantly and provides instant hot module replacement (HMR)
2. **Faster Builds**: Vite uses esbuild for faster bundling
3. **Simpler Configuration**: Single `vite.config.js` instead of complex Gruntfile
4. **Modern Tooling**: Built on modern JavaScript tooling with better ecosystem support
5. **Better DX**: Improved error messages and debugging experience
6. **Smaller Dependencies**: Reduced node_modules size (45 packages vs 321 packages)

## Implementation Details

### Custom HTML Includes Plugin
The Vite config includes a custom plugin that replicates the `grunt-includes` functionality:

```javascript
function htmlIncludesPlugin() {
  return {
    name: "html-includes",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        // Recursively processes include directives
        // Reads templates from src/_templates/
        // Supports nested includes
      }
    }
  }
}
```

### Static File Handling
The Vite config includes a plugin that copies static files to the build directory:
- favicon.ico
- icon.svg
- .htaccess
- aaronshekey_resume.pdf
- _redirects (for Netlify)
- Asset directories (_/img, _/fonts)

### Multi-Page Setup
Vite is configured to build all HTML pages as entry points using glob patterns:
- Main pages: index.html, about/index.html, resume/index.html
- Blog posts: posts/*/index.html
- Work pages: work/*/index.html

## Deployment

The deployment process remains the same:
1. Push to `master` branch
2. Netlify automatically runs `npm run build`
3. Deploys the `build/` directory

### Netlify Configuration
Updated `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"
```

Redirects moved from `.htaccess` to `_redirects` file for better Netlify compatibility.

## Troubleshooting

### If CSS isn't loading
- Make sure `src/_/css/tailwind.css` exists
- Check that `src/_templates/header.html` references `/_/css/tailwind.css`
- Run `npm run build` and verify CSS files in `build/_/css/`

### If includes aren't working
- Verify template files exist in `src/_templates/`
- Check the include syntax: `include "template.html"` (not `include 'template.html'`)
- Templates are processed recursively, so nested includes work

### If static files are missing
- Check the `copy-static-files` plugin in `vite.config.js`
- Verify files exist in `src/` directory
- Check build output in `build/` directory

## Testing the Migration

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Verify all pages load correctly at http://localhost:3030
4. Test navigation between pages
5. Build for production: `npm run build`
6. Preview production build: `npm run preview`
7. Verify all static assets (images, fonts, PDF) are accessible
8. Check that CSS is properly applied

## Rollback Plan

If you need to rollback to Grunt:
1. `git revert` the migration commit
2. Run `npm install` to restore Grunt dependencies
3. Use `npm start` to run the Grunt build

The original `Gruntfile.js` can be restored from git history.