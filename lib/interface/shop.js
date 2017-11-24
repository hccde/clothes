// interface
const Databse = require('../tools/database');
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
						updateNum+=1;
						console.log('update ' + e.name)
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
					createdNum +=1;
					console.log('created '+e.name);
				}
			}).catch((err) => {
				logFile.warn('warn: one insertion failed' + err.toString() + JSON.stringify(e));
				console.log(err);
			});
	}
}

module.exports = Shop;