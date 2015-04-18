'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || '52.17.3.23') + '/offtherift',
	/**
	 * Environment Include Files
	 * @type {Object}
	 */
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
						'public/lib/ngprogress/ngProgress.css',
						'public/lib/ng-mobile-menu/dist/ng-mobile-menu.min.css'
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
						'public/lib/ngprogress/build/ngProgress.min.js',
						'public/lib/ng-mobile-menu/dist/ng-mobile-menu.min.js'
					]
				},
				css: [
					'public/dist/application.min.css'
				],
				js: [
					'public/dist/application.min.js'
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
					'admin/dist/application.min.css'
				],
				js: [
					'admin/dist/application.min.js'
				]
			}
		},
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
