let Option = require('../lib/interface/option');
let Shop = require('../lib/interface/shop');
let request = require('request');
let Consumer = require('../lib/pattern/consumer');
const Databse = require('../lib/tools/database');
const logFile = require('../lib/tools/log');

let _ = require('lodash');
const RETRY = 3;

let iconv = require('iconv-lite');
let cheerio = require('cheerio');

const type_all = [{
	type:'ladies_all',
	uri:'http://www2.hm.com/zh_cn/ladies/shop-by-product/view-all.html'
},{
	type:'men_all',
	uri:'http://www2.hm.com/zh_cn/men/shop-by-product/view-all.html'
},{
	type:'kids_all',
	uri:'http://www2.hm.com/zh_cn/kids/shop-by-product/view-all.html'
},{
	type:'home_all',
	uri:'http://www2.hm.com/zh_cn/home/shop-by-product/view-all.html'
}]

let option = new Option({
	method:'GET',
	uri:'http://www2.hm.com/zh_cn/ladies/shop-by-product/view-all.html',
	qs:{
		'product-type':'ladies_all',
		'sort':'stock',
		'page-size':30,
		'offset':0
	},
	total:Number.MAX_VALUE,
	host:'http://www2.hm.com/',
	_retry:0,
	_type:0,
	timeout:12000, //timeout
 });
let time = new Date();
let sigleton = null;

class HM extends Shop {
	constructor(){
		super();
		if(!sigleton){
			sigleton = this;
		}else{
			return sigleton;
		}
	};

	async run(opt = _.cloneDeep(option)){
		await new Consumer().push(()=>{
			return new Promise((resolve,reject)=>{
				let req = request(opt,function(err,res){	
					if(err){
						//failed,retry 3 times
						reject(err);
						sigleton.isRetry(opt,err);
					}else{
						req = null;
						let r = sigleton.handler( iconv.decode(res.body,'utf-8') );
						r.forEach((e)=>{
							sigleton.saveData(e);
						})
						resolve(true);
					}
				})
			}).catch((e)=>{
				//request error for example: timeout
				sigleton.isRetry(opt,e);
			})
		});
		if(opt._retry > 0){ 
			return true;
		}
		option.qs['offset'] += option.qs['page-size'];
		if(option.qs['offset'] <= option.total){
			//call itself,avoid callmaxium
			setTimeout(sigleton.run,0);
		}else{
			if(option._type >= 3){
				sigleton.resetOption(option);
				sigleton.finish();
			}else{
				sigleton.resetOption(option);
				console.log(type_all[option._type]);
				setTimeout(sigleton.run,0);
			}
		}
	};

	isRetry(opt,e){
		if(opt._retry < RETRY){
			opt._retry+=1;
			sigleton.run(opt);
		}else{
			logFile.warn('warn: one request failed' + e.toString() + JSON.stringify(opt));
			console.log(e);
		}
	}

	resetOption(opt){
		opt._type = opt._type >= type_all.length-1?0:opt._type+1 //index == 3 reset _type
		opt.total = Number.MAX_VALUE;
		opt.uri = type_all[opt._type].uri;
		opt.qs['product-type'] = type_all[opt._type].type;
		opt.qs.offset = 0;
	}

	handler(str){
		let $ = cheerio.load(str);
		let res = [];
		option.total = $('.listing-total-count').data().totalCount;
		let host = option.host;
		try{
			$('.product-item').each(function(index,el){
				let href = host + $(el).find('a').attr('href');
				let name = $(el).find('a').attr('title');
				let img = 'http:'+ $(el).find('img').attr('src');
				let price = Number($(el).find('.price').eq(0).text().trim().replace(',','').replace('¥','').trim());
				res.push({
					href:href,
					name:name,
					img:img,
					price:price,
					sale:-1,
					desc:'',
					id:'hm'+ new Buffer(name, 'utf-8').toString('hex'),
					history:'',
					yestdayprice:0, 
					pricechange:0,
					updateAt:new Date().getTime()
				});
			});
			if(res.length === 0){
				throw('page changed');
			}
		}catch(e){
			console.log(e);
			logFile.error('fatal:page changed,selectors have failed: '+e.toString());
		}
		return res;
	};
}

module.exports = HM