import { defineConfig } from "vite";
import { resolve, relative, dirname } from "path";
import fs from "fs";
import { glob } from "glob";

// Plugin to handle HTML includes similar to grunt-includes
function htmlIncludesPlugin() {
	return {
		name: "html-includes",
		configureServer(server) {
			// Watch template files and trigger full reload on changes
			const templatesPath = resolve(process.cwd(), "src/_templates");
			server.watcher.add(`${templatesPath}/**/*.html`);

			server.watcher.on("change", (file) => {
				if (file.includes("_templates")) {
					server.ws.send({
						type: "full-reload",
						path: "*",
					});
				}
			});
		},
		transformIndexHtml: {
			order: "pre",
			handler(html, ctx) {
				// Process include directives recursively
				function processIncludes(content, includedFiles = []) {
					const includeRegex = /include\s+"([^"]+)"/g;
					let result = content;
					let hasIncludes = false;
					let match = includeRegex.exec(content);

					while (match !== null) {
						hasIncludes = true;
						const templatePath = match[1];
						const fullPath = resolve(
							process.cwd(),
							"src/_templates",
							templatePath,
						);

						try {
							const templateContent = fs.readFileSync(fullPath, "utf-8");
							result = result.replace(match[0], templateContent);

							// Track included files for HMR
							if (!includedFiles.includes(fullPath)) {
								includedFiles.push(fullPath);
							}
						} catch {
							console.warn(
								`Warning: Could not include template ${templatePath}`,
							);
						}

						match = includeRegex.exec(content);
					}

					// Process recursively if we found includes
					if (hasIncludes) {
						return processIncludes(result, includedFiles);
					}

					return result;
				}

				let processed = processIncludes(html);

				// Calculate relative path from HTML file to CSS file
				const htmlDir = dirname(ctx.filename);
				const cssPath = resolve(process.cwd(), "src/_/css/tailwind.css");
				let relativePath = relative(htmlDir, cssPath);

				// Normalize path separators for cross-platform compatibility
				relativePath = relativePath.replace(/\\/g, "/");

				// Ensure path starts with ./ for relative imports
				if (!relativePath.startsWith(".")) {
					relativePath = "./" + relativePath;
				}

				// Replace the absolute CSS path with a relative import that Vite can process
				processed = processed.replace(
					'<link rel="stylesheet" href="/_/css/tailwind.css" />',
					`<link rel="stylesheet" href="${relativePath}" />`,
				);

				return processed;
			},
		},
	};
}

export default defineConfig({
	root: "src",
	publicDir: false,
	build: {
		outDir: "../build",
		emptyOutDir: true,
		assetsInlineLimit: 0,
		rollupOptions: {
			input: {
				main: resolve(process.cwd(), "src/index.html"),
				about: resolve(process.cwd(), "src/about/index.html"),
				resume: resolve(process.cwd(), "src/resume/index.html"),
				posts: resolve(process.cwd(), "src/posts/index.html"),
				work: resolve(process.cwd(), "src/work/index.html"),
				...Object.fromEntries(
					glob
						.sync("src/posts/*/index.html", { cwd: process.cwd() })
						.map((file) => [
							file
								.replace("src/", "")
								.replace("/index.html", "")
								.replace(/\//g, "-"),
							resolve(process.cwd(), file),
						]),
				),
				...Object.fromEntries(
					glob
						.sync("src/work/*/index.html", { cwd: process.cwd() })
						.map((file) => [
							file
								.replace("src/", "")
								.replace("/index.html", "")
								.replace(/\//g, "-"),
							resolve(process.cwd(), file),
						]),
				),
			},
			output: {
				assetFileNames: (assetInfo) => {
					// Keep CSS in _/css directory
					if (assetInfo.name.endsWith(".css")) {
						return "_/css/[name].[hash][extname]";
					}
					// Keep images in _/img directory
					if (/\.(png|jpe?g|svg|gif|webp)$/.test(assetInfo.name)) {
						return "_/img/[name].[hash][extname]";
					}
					// Keep fonts in _/fonts directory
					if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
						return "_/fonts/[name][extname]";
					}
					return "assets/[name].[hash][extname]";
				},
			},
		},
	},
	server: {
		port: 3030,
		open: false,
	},
	plugins: [
		htmlIncludesPlugin(),
		{
			name: "copy-static-files",
			writeBundle() {
				// Copy static files that aren't processed by Vite
				const staticFiles = [
					"favicon.ico",
					"icon.svg",
					".htaccess",
					"aaronshekey_resume.pdf",
					"_redirects",
				];

				staticFiles.forEach((fileName) => {
					try {
						fs.copyFileSync(
							resolve(process.cwd(), "src", fileName),
							resolve(process.cwd(), "build", fileName),
						);
					} catch {
						console.warn(`Warning: Could not copy ${fileName}`);
					}
				});

				// Copy asset directories
				const copyDir = (src, dest) => {
					if (!fs.existsSync(src)) return;
					if (!fs.existsSync(dest)) {
						fs.mkdirSync(dest, { recursive: true });
					}
					const entries = fs.readdirSync(src, { withFileTypes: true });
					for (const entry of entries) {
						const srcPath = resolve(src, entry.name);
						const destPath = resolve(dest, entry.name);
						if (entry.isDirectory()) {
							copyDir(srcPath, destPath);
						} else {
							fs.copyFileSync(srcPath, destPath);
						}
					}
				};

				// Copy asset directories (excluding CSS since Vite processes it)
				copyDir(
					resolve(process.cwd(), "src/_/img"),
					resolve(process.cwd(), "build/_/img"),
				);
				copyDir(
					resolve(process.cwd(), "src/_/fonts"),
					resolve(process.cwd(), "build/_/fonts"),
				);
			},
		},
	],
});
