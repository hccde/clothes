let Database = require('../../lib/tools/database');

function List(req,res){
	let currentPage =  Number(req.query.currentPage)
    currentPage =  currentPage>=1?currentPage:1;
    let keyword = req.query.key.toString();
    console.log(keyword)
	let pageSize = Number(req.query.pageSize.toString());
	pageSize =  pageSize > 0? pageSize:15;
    let beforeDay = new Date().getTime() - 12*3600*2400;
	Database.Main.findAll({
        where: { 
            name: { 
                [Database.sequelize.Op.like]: '%'+keyword+'%'
            },
            updateAt:{
                [Database.sequelize.Op.gte]:beforeDay
            }
        },
		order: [['pricechange', 'ASC']],
		limit:pageSize, 
		offset:pageSize*currentPage
	}).then((obj)=>{
        obj.forEach((e)=>{
            e.history = '';
        });
		res.json(obj);
	});
}

module.exports = List;