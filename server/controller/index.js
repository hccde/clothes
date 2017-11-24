let List = require('./list.controller');
let History = require('./history.controller');

function bootstrap(app){
	app.get('/list', function (req, res) {
		List(req,res);
	});
	app.get('/history',function(req,res){
		History(req,res);
	})
}
module.exports = bootstrap;