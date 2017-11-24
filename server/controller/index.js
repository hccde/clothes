let logFile = require('../lib/log');
let List = require('./list.controller');
let History = require('./history.controller');

function bootstrap(app){
	app.get('/list', function (req, res) {
		req.connection.remoteAddress // get ip todo
		logFile.info(req.connection.remoteAddress)
		List(req,res);
	});
	app.get('/history',function(req,res){
		logFile.info('')
		History(req,res);
	})
}
module.exports = bootstrap;