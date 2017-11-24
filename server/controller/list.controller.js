let Database = require('../../lib/tools/database');

function List(req,res){
	let currentPage =  Number(req.query.currentPage)
	currentPage =  currentPage>=1?currentPage:1;
	let pageSize = Number(req.query.pageSize.toString());
	pageSize =  pageSize > 0? pageSize:15;

	Database.Main.findAll({
		where: {
		  	pricechange:{
		  		[Database.sequelize.Op.ne]:0
		  	}
		  },
		 order: [['pricechange', 'ASC']],
		 limit:pageSize, 
		 offset:pageSize*currentPage
	}).then((obj)=>{
		res.json(obj);
	});
}

module.exports = List;