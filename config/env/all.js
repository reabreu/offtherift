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
	/**
	 * Environment files to uglyfy
	 * @type {Object}
	 */
	assets: {
		env: {
			/**
			 * Public Environment
			 */
			public: {
				css: [
					'public/modules/**/css/*.css'
				],
				js: [
					'public/config.js',
					'public/application.js',
					'public/modules/*/*.js',
					'public/modules/*/*[!tests]*/*.js',

					/**
					 * Admin shared services
					 */
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
			},
			/**
			 * Admin Environment
			 */
			admin: {
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
	}
};