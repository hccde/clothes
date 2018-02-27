// interface
const Database = require('../tools/database');
const logFile = require('../tools/log');
const utils = require('../tools/utils');
const mail = require('../mail.js');

let createdNum = 0;
let updateNum = 0;

let forth = utils.fnN(4,()=>{
	console.log('finished all');
	setTimeout(()=>{
		mail.send({
			createdNum:createdNum,
			updateNum:updateNum,
			errorText:logFile.warnText,
			warnText:logFile.warnText,
			errorNum:logFile.errorNum,
			warnNum:logFile.warnNum
		});
		// reset
		logFile.warnNum = 0;
		logFile.errorNum = 0;
		logFile.errorText = '';
		logFile.warnText = '';
		createdNum = 0;
		updateNum = 0;
		//clear
		let isMonday = new Date().getDay() === 1;
		let beforeDay = new Date().getTime() - 12*3600*2400;
		if(isMonday){
			Database.Pricechange.destroy({
				where:{
					updateAt:{
						[Database.sequelize.Op.lt]: beforeDay
					}	
				}
			}).then(()=>{
				//delete
			})
		}

	},20000);
});

class Shop {
    constructor(){}

    run(){}

    finish(){
        forth();
    }

    handler(){}

    isRetry(){}

    resetOption(){}

    saveData(e) {
    	// console.log(e.name)
    	// return ;

		Database.Main.findOrCreate({ where: { id: e.id }, defaults: e })
			.spread((u, created) => {
				if (u) {//exist
					let record = u.get({
						plain: true
					});
					if (e.updateAt - record.updateAt >= 6 * 3600 * 1000) {
						updateNum+=1;
						console.log('update ' + e.name)
						e.yestdayprice = record.price;
						e.history = record.price.toString() + '|' + record.history
						e.pricechange = e.price - record.price;
						Database.Main.upsert(e).catch((err) => {
							logFile.warn('warn: one update failed' + err.toString() + JSON.stringify(e));
							console.log(err);
						});
						//update pricechanges table
						if(e.pricechange != 0){
							updatePriceTable({
								id: e.id,
								href:e.href,
								name:e.name,
								img:e.img,
								price:e.price,
								sale:e.sale, 
								desc:e.desc,
								history:new Date().getDay().toString()+':'+e.price,
								pricechange:e.pricechange ,
								isvaild:true,
								updateAt:new Date().getTime()
							});
						}
					}
				}
				//new items
				if (created) {
					createdNum +=1;
					console.log('created '+e.name);
				}
			}).catch((err) => {
				logFile.warn('warn: one insertion failed' + err.toString() + JSON.stringify(e));
				console.log(err);
			});
	}
}
//one day 24h has 2 record item in history;
function updatePriceTable(e){
	let isMonday = new Date().getDay() === 1;
	Database.Pricechange.findOrCreate({ where: { id: e.id }, defaults: e })
		.spread((u, created) => {
			if(u){
				let record = u.get({
					plain: true
				});
				if (e.updateAt - record.updateAt >= 6 * 3600 * 1000) { //may repeat
					e.history = isMonday?e.history:e.history + '|' + record.history;//on monday clear history
					Database.Pricechange.upsert(e).catch((err) => {
						logFile.warn('warn: one item pricetable update failed' + err.toString() + JSON.stringify(e));
						console.log(err);
					});
				}
			}
			if(created){

			}
	}).catch((err)=>{
		logFile.warn('warn: one item update pricetable failed' + err.toString() + JSON.stringify(e));
		console.log(err);
	});
}
module.exports = Shop;