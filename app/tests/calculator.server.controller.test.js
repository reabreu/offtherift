var should = require('should'),
	fs = require('fs'),
	calculator = require('../../app/controllers/calculator.server.controller');

var version = '5.3.1';

// Get the test files for the selected version.
var versionPath = './calculator/' + version + '/';
var files = fs.readdirSync(versionPath);

if (files.length != 0) {

	// For each file, there will be a test.
	for (var i = 0; i < files.length; i++) {
		var testCase = require(versionPath + files[i]);
		var result = calculator.processStats(testCase.test);
		var expected = testCase.expected;

		describe(testCase.description, function(err) {
			it('result should equal expected', function(err) {
				result.should.equal(expected);
			});
		});
	}
}
