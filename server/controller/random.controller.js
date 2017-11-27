let Database = require('../../lib/tools/database');

function Random(req,res){
	let currentPage =  Number(req.query.currentPage)
	currentPage =  parseInt(Math.random()*1500);//hard coding
	let pageSize = 15;

	Database.Main.findAll({
		 limit:pageSize, 
		 offset:pageSize*currentPage
	}).then((obj)=>{
		res.json(obj);
	});
}

module.exports = Random;