# aaronshekey.com

My personal website https://aaronshekey.com/

## Development

This site uses Vite to build its pages. The HTML templating system uses simple `include` directives to compose pages from reusable templates.

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3030` with hot module reloading.

### Building for Production

To build the site for production:

```bash
npm run build
```

The built files will be output to the `build/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment

Merging to `master` automatically deploys the site via Netlify. ✌️

## Project Structure

```
src/
├── _/                     # Assets directory
│   ├── css/               # Stylesheets (Tailwind CSS)
│   ├── fonts/             # Web fonts
│   └── img/               # Images
├── _templates/            # Reusable HTML templates
├── about/                 # About page
├── posts/                 # Blog posts
├── resume/                # Resume page
├── work/                  # Work/portfolio pages
└── index.html             # Homepage
```

## Technology Stack

- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Custom HTML includes** - Simple templating system via Vite plugin
