let Database = require('../../lib/tools/database');

function History(req,res){
	Database.Main.findAll({
		where: {
		  	id:String(req.query.id)
		  }
	}).then((obj)=>{
		res.json(obj);
	});
}

module.exports = History;