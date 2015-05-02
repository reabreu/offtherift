'use strict';
var fs = require('fs');

exports.getLang = function(req, res) {
    var lang    = req.param('lang');
    var path    = './lang/' + lang + '/' + lang + '.json';
    fs.readFile(path, 'utf8', function (err,data) {
        if (err) {
            return res.status(404).send();
        }
        res.jsonp(JSON.parse(data));
    });
};
