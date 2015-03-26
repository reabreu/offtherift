'use strict';

module.exports = {
	db: 'mongodb://localhost/offtherift-dev',
	app: {
		title: 'Off the Rift - Development',
		api: {
			version: 	'/v1.2',
			region: 	'/euw',
			endpoint: 	'https://global.api.pvp.net/api/lol/static-data',
			api_key: 	'api_key=02d31520-47fc-4e61-a721-5d84a913229c'
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
