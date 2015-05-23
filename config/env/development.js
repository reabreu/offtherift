'use strict';

module.exports = {
	db: 'mongodb://localhost/offtherift-dev',
	app: {
		title: 'Offtherift - Development',
		api: {
			version: 	'/v1.2',
			region: 	'/euw',
			endpoint: 	'https://global.api.pvp.net/api/lol/static-data',
			api_key: 	'api_key=02d31520-47fc-4e61-a721-5d84a913229c'
		}
	},
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
						'public/lib/ng-mobile-menu/dist/ng-mobile-menu.min.css',
						'public/lib/angular-block-ui/dist/angular-block-ui.min.css'
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
						'public/lib/ng-mobile-menu/dist/ng-mobile-menu.min.js',
						'public/lib/angular-block-ui/dist/angular-block-ui.min.js'
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
					'admin/modules/masteries/services/masteries.client.service.js',
					'admin/modules/users/services/hashes.client.service.js'
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
		}
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '671726556258325',
		clientSecret: process.env.FACEBOOK_SECRET || '618e4ac3c109ed7e355da58b3cac3e51',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'a098XpS0YtwADvALiOulQqQhg',
		clientSecret: process.env.TWITTER_SECRET || 'CF4tZyT6m7IYk9vP4wipvyZdIO9zu9ftuCMrbT6WsIjPYL32y4',
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
		service: 'gmail',
		auth: {
			user: process.env.MAILER_EMAIL_ID || 'GMAIL_USER',
			pass: process.env.MAILER_PASSWORD || 'GMAIL_PASSWORD'
		}
		/*
		from: process.env.MAILER_FROM || 'Inviter <inviter@offtherift.com>',
		options: {
			host: process.env.MAILER_SERVICE_PROVIDER || 'mail.offtherift.com',
			port: 465,
            secure: true,
            tls: { rejectUnauthorized: false },
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'noreply@offtherift.com',
				pass: process.env.MAILER_PASSWORD || '3e27W3L0o9gZ'
			}
		}
		*/
	}
};
