'use strict';

module.exports = {
	app: {
		title: 'offtherift',
		description: 'Nice League of Legends Builds Generator',
		keywords: 'lol, builds, league of legends'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/iCheck/skins/minimal/blue.css',
				'public/lib/angular-block-ui/dist/angular-block-ui.min.css',
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jScrollPane/script/jquery.jscrollpane.min.js',
				'public/lib/iCheck/icheck.min.js',
				'public/lib/jquery-touchswipe/jquery.touchSwipe.min.js',
				'public/lib/enquire/dist/enquire.min.js',
				'public/lib/bootstrap-switch/dist/js/bootstrap-switch.min.js',
				'public/lib/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js',
				'public/lib/angular-block-ui/dist/angular-block-ui.min.js',
				'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};