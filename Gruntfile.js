module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		clean: ["build"],
		includes: {
			build: {
				cwd: "src",
				src: ["**/*.html", "!**/_templates/*.html"],
				dest: "build/",
				options: {
					flatten: true,
					includePath: "src/_templates",
				},
			},
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: ["**", "!**/_templates/**"],
						dest: "build/",
						flatten: false,
						dot: true,
					},
				],
			},
		},
		shell: {
			tailwind: {
				command:
					"npx tailwindcss -i src/_/css/tailwind.css -o build/_/css/tailwind.css --minify",
			},
		},
		connect: {
			server: {
				options: {
					port: 3030, // custom port
					base: "build/", // current directory for 'index.html' is root
					keepalive: true, // keep the server alive indefinitely
					livereload: true,
				},
			},
		},
		watch: {
			scripts: {
				files: ["src/**/*"],
				tasks: ["clean", "copy", "shell:tailwind", "concat", "includes"],
				options: {
					livereload: true,
				},
			},
		},
		concurrent: {
			options: {
				logConcurrentOutput: true,
			},

			serve: ["connect", "watch"],
		},
		concat: {
			basic: {
				src: ["build/_/css/*.css"],
				dest: "build/_/css/site.css",
			},
		},
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-includes");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-shell");

	// Default task(s).
	grunt.registerTask("default", ["build", "concurrent:serve"]);
	grunt.registerTask("build", [
		"clean",
		"copy",
		"shell:tailwind",
		"concat",
		"includes",
	]);
};
