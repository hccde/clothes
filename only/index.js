let Option = require('../lib/interface/option');
let request = require('request');
let Consumer = require('../lib/pattern/consumer');
const Databse = require('../lib/tools/database');
const logFile = require('../lib/tools/log');
const type_all = [];
let _ = require('lodash');
const RETRY = 3;

let iconv = require('iconv-lite');
let cheerio = require('cheerio');

//man child todo
let option = new Option({
	method: 'GET',
	uri: 'http://www.only.cn/api/goods/goodsList',
	qs:{
		classifyIds:111163,
		currentpage:1,
		goodsHighPrice:'',
		goodsLowPrice:'',
		goodsSelect:'',
		sortDirection:'desc',
		sortType:1
	},
	encoding:'utf-8',
	json:true,
	headers:{
		'Accept':'application/json, text/plain, */*',
		'Referer':'http://www.only.cn/goodsList.html?classifyIds=111163',
		'Host':'www.only.cn',
		'Cookie':'_ga=GA1.2.1984968142.1511338656; _gid=GA1.2.1420704672.1511338656',
		'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTEzMzg2NDIsImNoYW5uZWwiOiI2IiwiaXNzIjoibHpzeiIsImp0aSI6ImVhM2Y0YTZhLWFkZmEtNDlkZS04M2RkLWRjZmQ0MjA1Yjk5ZiJ9.IGGDa2ONzsoQRu097JsCOpnsyeEP8SevAnMP18XxJaI'
	},
	total: Number.MAX_VALUE,
	_retry: 0,
	_type: 0,
	timeout: 12000, //timeout
});
let time = new Date();
let sigleton = null;

class Only {
	constructor() {
		if (!sigleton) {
			sigleton = this;
		} else {
			return sigleton;
		}
	};

	async run(opt = _.cloneDeep(option)) {
		if(type_all.length == 0){
			await sigleton.pre_get();
			sigleton.resetOption(option);
			sigleton.resetOption(opt);
		}
		await new Consumer(3).push(() => {
			return new Promise((resolve, reject) => {
				let req = request(opt, function (err, res, body) {
					if (err) {
						//failed,retry 3 times
						reject(err);
						sigleton.isRetry(opt, err);
					} else {
						req = null;
						let r = sigleton.handler(body);
						r.forEach((e) => {
							sigleton.saveData(e);
							// console.log(e);
						})
						resolve(true);
					}
				})
			}).catch((e) => {
				//request error for example: timeout
				sigleton.isRetry(opt, e);
			})
		});

		option.qs.currentpage += 1;
		if (option.qs.currentpage <= option.total) {
			//call itself,avoid callmaxium
			setTimeout(sigleton.run, 0);
		} else {
				if(option._type >= type_all.length-1){
					sigleton.resetOption(option);
					
				}else{
					sigleton.resetOption(option);
					setTimeout(sigleton.run,0);
				}
		}
	};

	async pre_get(opt = _.cloneDeep(option)){
		await new Promise((resolve,reject)=>{
			let req = request('http://www.only.cn/classify/h5/ONLY/h5_list.json', function (err, res) {
				if (err) {
					//failed,retry 3 times
					logFile.error('fatal error cannt get basic info' )
				} else {
					req = null;
					let json = JSON.parse(res.body.toString());
					json.data.forEach((e)=>{
						type_all.push(e);
						if(e.list.length>0){ // deep == 2, just simple to flate
							e.list.forEach((ee)=>{
								type_all.push(ee);
							})
						}
					});
					resolve(true);
				}
			});
		})
	}

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
		opt._type = opt._type < type_all.length-1?opt._type+1:0;
		opt.total = Number.MAX_VALUE;
		opt.qs.classifyIds = type_all[opt._type].classifyId;
		opt.qs.currentpage = 1;
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
							console.log(err);
						});
					}
				}
				if (created) {
					console.log('created only '+e.name);
				}
			}).catch((err) => {
				logFile.warn('warn: one insertion failed' + err.toString() + JSON.stringify(e));
				console.log(err);
			});
	}

	handler(data){
		let res = [];
		option.total = data.totalPage;
		try{
		data.data.forEach((good)=>{
			res.push({
				href:'http://www.only.cn/goodsDetails.html?design='+good.goodsCode,
				name:good.goodsName,
				img:option.headers.Host+good.gscMaincolPath,
				price:good.originalPrice,
				sale:good.sellCount,
				desc:good.name+' : '+good.goodsInfo,
				id:'only'+ new Buffer(good.goodsName, 'utf-8').toString('hex'),
				history:'',
				yestdayprice:0, 
				pricechange:0,
				updateAt:new Date().getTime()
			});
		})
	}catch(e){
		logFile.error('fatal error " only " page has changed ' + e.toString());
	}	
		return res;
	}
}

module.exports = Only