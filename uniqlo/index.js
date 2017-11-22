let Option = require('../lib/interface/option');
let request = require('request');
let Consumer = require('../lib/pattern/consumer');
const Databse = require('../lib/tools/database');
const logFile = require('../lib/tools/log');

let _ = require('lodash');
const RETRY = 3;

let iconv = require('iconv-lite');
let cheerio = require('cheerio');

let option = new Option({
	method: 'GET',
	uri: 'http://www.uniqlo.cn/search.htm?search=y&viewType=grid&orderType=_newOn',
	qs: {
		pageNum: 1
	},
	total: Number.MAX_VALUE,
	host: 'http://www.uniqlo.cn/',
	_retry: 0,
	_type: 0,
	timeout: 12000, //timeout
});
let time = new Date();
let sigleton = null;

class Uniqlo {
	constructor() {
		if (!sigleton) {
			sigleton = this;
		} else {
			return sigleton;
		}
	};

	async run(opt = _.cloneDeep(option)) {
		await new Consumer(3).push(() => {
			return new Promise((resolve, reject) => {
				let req = request(opt, function (err, res) {
					if (err) {
						//failed,retry 3 times
						reject(err);
						sigleton.isRetry(opt, err);
					} else {
						req = null;
						let r = sigleton.handler(iconv.decode(res.body, 'gbk').toString());
						r.forEach((e) => {
							sigleton.saveData(e);
						})
						resolve(true);
					}
				})
			}).catch((e) => {
				//request error for example: timeout
				sigleton.isRetry(opt, e);
			})
		});
		option.qs['pageNum'] += 1;
		if (option.qs['pageNum'] <= option.total) {
			//call itself,avoid callmaxium
			setTimeout(sigleton.run, 0);
		}
	};

	isRetry(opt, e) {
		if (opt._retry < RETRY) {
			opt._retry += 1;
			sigleton.run(opt);
		} else {
			logFile.warn('warn: one request failed' + e.toString() + JSON.stringify(opt));
			console.log(e);
		}
	}

	resetOption(opt) {
		opt.total = Number.MAX_VALUE;
		opt.qs.pageNum = 0;
	}

	saveData(e) {
		Databse.Main.findOrCreate({ where: { id: e.id }, defaults: e })
			.spread((u, created) => {
				if (u) {//exist
					let record = u.get({
						plain: true
					});
					if (e.updateAt - record.updateAt >= 24 * 3600 * 1000) {
						console.log('update ' + e.name)
						e.yestdayprice = record.price;
						e.history = record.price.toString() + '|' + record.history
						e.pricechange = e.price - record.price;
						Databse.Main.upsert(e).catch((err) => {
							logFile.warn('warn: one update failed' + err.toString() + JSON.stringify(e));
							//try to update again
							Databse.Main.upsert(e);
						});
					}
				}
				if (created) {
					console.log('created ' + e.name);
				}
			}).catch((err) => {
				logFile.warn('warn: one insertion failed' + err.toString() + JSON.stringify(e));
				console.log(err);
			});
	}

	handler(str) {
		let $ = cheerio.load(str);
		let pageInfo = $('.page-info').text().split('/');
		let res = [];
		option.total = Number(pageInfo[1]);
		let goods = [];
		try {
			goods = $('.shop-list').find('li');
			goods.map((index, el) => {
				let aele = $(el).find('.pic a')[0];
				let desc = $(el).find('.desc')[0];
				let price = $(el).find('.price strong')[0];
				let saleAmount = $(el).find('.sales-amount em');
				res.push({
					href: $(aele).attr('href'),
					name: $(desc).text().trim(),
					img: $(aele).find('img').data('ks-lazyload') || $(aele).find('img').attr('src'),
					price: Number($(price).text()),
					sale: Number($(saleAmount).text()),
					desc: $(desc).text().trim(),
					id: 'hm' + new Buffer($(desc).text().trim(), 'utf-8').toString('hex'),
					history: '',
					yestdayprice: 0,
					pricechange: 0,
					updateAt: new Date().getTime()
				});
			})
		} catch (e) {
			logFile.warn('uniqlo page has changed,some class selector failed' + e.toString());
		}
		return res;
	};
}

module.exports = Uniqlo