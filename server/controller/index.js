let logFile = require('../lib/log');
let Database = require('../../lib/tools/database');
let List = require('./list.controller');
let History = require('./history.controller');
let Random = require('./random.controller');
let newItem = require('./newItem.controller');
let search = require('./search.controller');

function bootstrap(app){
	app.get('/list', function (req, res) {
		saveIp({
			id:String(req.connection.remoteAddress),
			count:1,
			updateAt:new Date().getTime()
		});
		List(req,res);
	});
	app.get('/random', function (req, res) {
		Random(req,res);
	});

	app.get('/newItem', function (req, res) {
		newItem(req,res);
	});
	app.get('/search',function(req,res){
		search(req,res);
	})
	app.get('/history',function(req,res){
		saveIp({
			id:String(req.connection.remoteAddress),
			count:1,
			updateAt:new Date().getTime()
		});
		History(req,res);
	})
}
function saveIp(e){
	console.log(e);
	Database.Ip.findOrCreate({ where: { id: e.id }, defaults: e })
	.spread((u, created) => {
		if (u) {//exist
			let record = u.get({
				plain: true
			});
				e.count = (record.count+=1);
				Database.Ip.upsert(e).catch((err) => {
					logFile.warn('warn: one update failed' + err.toString() + JSON.stringify(e));
					console.log(err);
				});
			}
	}).catch((err) => {
		logFile.warn('warn: one insertion failed' + err.toString() + JSON.stringify(e));
		console.log(err);
	});
}
module.exports = bootstrap;