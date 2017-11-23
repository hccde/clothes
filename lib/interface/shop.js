// interface
const Databse = require('../tools/database');
const logFile = require('../tools/log');
const utils = require('../tools/utils');

let forth = utils.fnN(4,()=>{
	console.log('finished all');
	logFile.warn('finished all')
	setTimeout(()=>{
		Databse.sequelize.close().catch((e)=>{
			logFile.error(e.toString());
		})
	},20000);
    //todo
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
		Databse.Main.findOrCreate({ where: { id: e.id }, defaults: e })
			.spread((u, created) => {
				if (u) {//exist
					let record = u.get({
						plain: true
					});
					if (e.updateAt - record.updateAt >= 6 * 3600 * 1000) {
						// console.log('update ' + e.name)
						e.yestdayprice = record.price;
						e.history = record.price.toString() + '|' + record.history
						e.pricechange = e.price - record.price;
						Databse.Main.upsert(e).catch((err) => {
							logFile.warn('warn: one update failed' + err.toString() + JSON.stringify(e));
							console.log(err);
						});
					}
				}
				if (created) {
					// console.log('created '+e.name);
				}
			}).catch((err) => {
				logFile.warn('warn: one insertion failed' + err.toString() + JSON.stringify(e));
				console.log(err);
			});
	}
}

module.exports = Shop;