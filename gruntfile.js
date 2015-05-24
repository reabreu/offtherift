'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['public/modules/**/views/**/*.html', 'public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js', 'admin/js/*.js', 'admin/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.min.css', 'admin/modules/**/*.min.css'],
		mochaTests: ['app/tests/**/*.js'],
		clientLESS: ['public/modules/**/*.less', 'admin/modules/**/*.less'],
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			clientLESS: {
                files: watchFiles.clientLESS,
                tasks: ['less'],
                options: {
                    livereload: true,
                }
            }
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'admin/dist/application.min.js': 'admin/dist/application.js',
					'public/dist/application.min.js': 'public/dist/application.js',
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'admin/dist/application.min.css': '<%= adminCSSFiles %>',
					'public/dist/application.min.css': '<%= publicCSSFiles %>',
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'admin/dist/application.js': '<%= adminJavaScriptFiles %>',
					'public/dist/application.js': '<%= publicJavaScriptFiles %>',
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		less: {
			development: {
				options: {
					paths: ['admin/modules', 'public/modules'],
					compress: true,
					cleancss: true
				},
				files: [
					/**
					 * Admin LESS Files
					 * @type {String}
					 */
					{ src: 'admin/modules/core/less/**/styles.less',   dest: 'admin/modules/core/css/core.min.css'  },
					{ src: 'admin/modules/users/less/**/styles.less', 	dest: 'admin/modules/users/css/users.min.css' },
					{ src: 'admin/modules/items/less/styles.less', 	dest: 'admin/modules/items/css/items.min.css' },
					{ src: 'admin/modules/patches/less/styles.less', 	dest: 'admin/modules/patches/css/patches.min.css'},
					/**
					 * Public LESS Files
					 * @type {String}
					 */
					{ src: 'public/modules/core/less/**/styles.less',   dest: 'public/modules/core/css/core.min.css'  },
					{ src: 'public/modules/users/less/**/styles.less', 	dest: 'public/modules/users/css/users.min.css' },
					{ src: 'public/modules/builds/less/**/styles.less', 	dest: 'public/modules/builds/css/build.min.css' },
				],
			},
			production: {
				options: {
					paths: ['admin/modules', 'public/modules'],
					compress: true,
					cleancss: true
				},
				files: [
					/**
					 * Admin LESS Files
					 * @type {String}
					 */
					//{ src: 'admin/modules/**/less/**/styles.less',   dest: 'admin/modules/core/css/core.min.css'  },
					/**
					 * Public LESS Files
					 * @type {String}
					 */
					//{ src: 'public/modules/**/less/**/styles.less',   dest: 'public/modules/dist/css/core.min.css'  },
				],
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Load NPM LESS Task
	grunt.loadNpmTasks('grunt-contrib-less');

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('publicJavaScriptFiles', config.assets.env.public.js);
		grunt.config.set('publicCSSFiles', config.assets.env.public.css);

		grunt.config.set('adminJavaScriptFiles', config.assets.env.admin.js);
		grunt.config.set('adminCSSFiles', config.assets.env.admin.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['concurrent:default', 'less']); /*lint removed*/

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['loadConfig', 'ngAnnotate', 'uglify', 'less:production', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};