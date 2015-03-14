var should = require('should'),
	assert = require('assert'),
	fs = require('fs'),
	calculator = require('../../app/controllers/calculator.server.controller');

var version = '5.4.1';

// Get the test files for the selected version.
var versionPath = './calculator/' + version + '/';
var files = fs.readdirSync(versionPath);

if (files.length != 0) {

	// For each file, there will be a test.
	for (var i = 0; i < files.length; i++) {
		var testCase = require(versionPath + files[i]);
		var result = calculator.processStats(testCase.test).data;
		var expected = testCase.expected;

		describe(testCase.description, function() {
			for (var key in result) {
				statTest(key, result[key], expected[key]);
			}
		});
	}
}

function statTest(stat, result, expected) {
	it(stat + ': ' + result + ' should equal ' + expected, function(done) {
		result.should.eql(expected);
		done();
	});
}