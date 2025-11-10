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
		cssmin: {
			build: {
				files: [
					{
						expand: true,
						cwd: "build/_/css",
						src: ["*.css", "!*.min.css"],
						dest: "build/_/css",
						ext: ".css",
					},
				],
			},
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: ["**", "!**/_templates/**", "!_/css/*.less"],
						dest: "build/",
						flatten: false,
						dot: true,
					},
				],
			},
		},
		less: {
			build: {
				options: {
					paths: ["src/_/css/"],
				},
				files: {
					"build/_/css/custom.css": "src/_/css/custom.less",
				},
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
				tasks: [
					"clean",
					"copy",
					"less",
					"purgecss",
					"cssmin",
					"concat",
					"includes",
				],
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
		purgecss: {
			my_target: {
				options: {
					content: ["./src/**/*.html"],
					defaultExtractor: (content) => content.match(/[\w-:/]+(?<!:)/g) || [],
				},
				files: {
					"build/_/css/stacks.css": [
						"./node_modules/@stackoverflow/stacks/dist/css/stacks.css",
					],
				},
			},
		},
		concat: {
			basic: {
				src: ["build/_/css/*.css"],
				dest: "build/_/css/site.css",
			},
		},
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-includes");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-purgecss");

	// Default task(s).
	grunt.registerTask("default", ["build", "concurrent:serve"]);
	grunt.registerTask("build", [
		"clean",
		"copy",
		"less",
		"cssmin",
		"concat",
		"includes",
	]);
};
