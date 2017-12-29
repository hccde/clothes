let Database = require('../../lib/tools/database');

function List(req,res){
	let currentPage =  Number(req.query.currentPage)
	currentPage =  currentPage>=1?currentPage:1;
	let pageSize = Number(req.query.pageSize.toString());
	pageSize =  pageSize > 0? pageSize:15;
    let beforeDay = new Date().getTime() -12*3600*2400;
	Database.Main.findAll({
		where: {
			yestdayprice:{
		  		[Database.sequelize.Op.eq]:0
		  	}
		  },
		 order: [['createdAt', 'DESC']],
		 limit:pageSize, 
		 offset:pageSize*currentPage
	}).then((obj)=>{
		res.json(obj);
	});
}

module.exports = List;