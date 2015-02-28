'use strict';

module.exports = {
	app: {
		title: 'offtherift',
		description: 'Nice League of Legends Builds Generator',
		keywords: 'lol, builds, league of legends'
	},
	env: {
		public: {
			path: 'public/',
			assets: {
				lib: {
					css: [
						'public/lib/bootstrap/dist/css/bootstrap.min.css',
						'public/lib/font-awesome/css/font-awesome.min.css',
						'public/lib/iCheck/skins/minimal/blue.css',
						'public/lib/angular-block-ui/dist/angular-block-ui.min.css',
						'public/lib/ngtoast/dist/ngToast.min.css',
						'public/lib/yamm3/yamm/yamm.css',
						'public/lib/ngprogress/ngProgress.css'
					],
					js: [
						'public/lib/jquery/dist/jquery.min.js',
						'public/lib/angular/angular.js',
						'public/lib/angular-resource/angular-resource.js',
						'public/lib/angular-cookies/angular-cookies.js',
						'public/lib/ngFx/dist/ngFx.min.js',
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
						'public/lib/ngtoast/dist/ngToast.min.js',
						'public/lib/angular-translate/angular-translate.min.js',
						'public/lib/angular-translate-loader-url/angular-translate-loader-url.min.js',
						'public/lib/ngprogress/build/ngProgress.min.js'
					]
				},
				css: [
					'public/modules/**/css/*.css'
				],
				js: [
					'public/config.js',
					'public/application.js',
					'public/modules/*/*.js',
					'public/modules/*/*[!tests]*/*.js',

					'admin/modules/patches/patches.client.module.js',
					'admin/modules/patches/services/patches.client.service.js',
					'admin/modules/items/items.client.module.js',
					'admin/modules/items/services/items.client.service.js',
					'admin/modules/champions/champions.client.module.js',
					'admin/modules/champions/services/champions.client.service.js',
					'admin/modules/runes/runes.client.module.js',
					'admin/modules/runes/services/runes.client.service.js',
					'admin/modules/masteries/masteries.client.module.js',
					'admin/modules/masteries/services/masteries.client.service.js'
				],
				tests: [
					'public/lib/angular-mocks/angular-mocks.js',
					'public/modules/*/tests/*.js'
				]
			}
		},
		admin: {
			path: 'admin/',
			assets: {
				lib: {
					css: [
						'admin/lib/bootstrap/dist/css/bootstrap.min.css',
						'admin/lib/font-awesome/css/font-awesome.min.css',
						'admin/lib/iCheck/skins/minimal/blue.css',
						'admin/lib/angular-block-ui/dist/angular-block-ui.min.css',
						'admin/lib/ngtoast/dist/ngToast.min.css',
					],
					js: [
						'admin/lib/jquery/dist/jquery.min.js',
						'admin/lib/angular/angular.js',
						'admin/lib/angular-resource/angular-resource.js',
						'admin/lib/angular-cookies/angular-cookies.js',
						'admin/lib/angular-animate/angular-animate.js',
						'admin/lib/angular-touch/angular-touch.js',
						'admin/lib/angular-sanitize/angular-sanitize.js',
						'admin/lib/angular-ui-router/release/angular-ui-router.js',
						'admin/lib/angular-ui-utils/ui-utils.js',
						'admin/lib/bootstrap/dist/js/bootstrap.min.js',
						'admin/lib/angular-bootstrap/ui-bootstrap-tpls.js',
						'admin/lib/jScrollPane/script/jquery.jscrollpane.min.js',
						'admin/lib/iCheck/icheck.min.js',
						'admin/lib/jquery-touchswipe/jquery.touchSwipe.min.js',
						'admin/lib/enquire/dist/enquire.min.js',
						'admin/lib/bootstrap-switch/dist/js/bootstrap-switch.min.js',
						'admin/lib/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js',
						'admin/lib/angular-block-ui/dist/angular-block-ui.min.js',
						'admin/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
						'admin/lib/ngtoast/dist/ngToast.min.js'
					]
				},
				css: [
					'admin/modules/**/css/*.css'
				],
				js: [
					'admin/config.js',
					'admin/application.js',
					'admin/modules/*/*.js',
					'admin/modules/*/*[!tests]*/*.js'
				],
				tests: [
					'admin/lib/angular-mocks/angular-mocks.js',
					'admin/modules/*/tests/*.js'
				]
			}
		},
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		css: [
			/**
			 * Admin Environment
			 */
			'admin/modules/**/css/*.css',
			/**
			 * Public Environment
			 */
			'public/modules/**/css/*.css'
		],
		js: [
			/**
			 * Admin Environment
			 */
			'admin/config.js',
			'admin/application.js',
			'admin/modules/*/*.js',
			'admin/modules/*/*[!tests]*/*.js',
			/**
			 * Public Environment
			 */
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			/**
			 * Admin Environment
			 */
			'admin/lib/angular-mocks/angular-mocks.js',
			'admin/modules/*/tests/*.js',
			/**
			 * Public Environment
			 */
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};