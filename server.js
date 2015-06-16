'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
    session = require('cookie-session');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

//Set Session key
app.use(session({
    keys: ['shell']
}))


// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('   _____ _          _ _ ____            _                     \r\n' +
'  / ____| |        | | |  _ \\          (_)                    \r\n' +
' | (___ | |__   ___| | | |_) |_   _ ___ _ _ __   ___  ___ ___ \r\n' +
'  \\___ \\| \'_ \\ / _ \\ | |  _ <| | | / __| | \'_ \\ / _ \\/ __/ __|\r\n' +
'  ____) | | | |  __/ | | |_) | |_| \\__ \\ | | | |  __/\\__ \\__ \\\r\n' +
' |_____/|_| |_|\\___|_|_|____/ \\__,_|___/_|_| |_|\\___||___/___/\r\n' +
'                                                              \r\n' +
'Listen on port ' + config.port);