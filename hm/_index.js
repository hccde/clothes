let Option = require('../lib/interface/option');
let request = require('request');
let Consumer = require('../lib/pattern/consumer');
let _ = require('lodash');
const RETRY = 3;

let iconv = require('iconv-lite');
let cheerio = require('cheerio');

let option = new Option({
	method:'GET',
	uri:'http://www2.hm.com/zh_cn/ladies/shop-by-product/view-all.html',
	qs:{
		'product-type':'ladies_all',
		'sort':'stock',
		'page-size':30,
		'currentOffset':0
	},
	total:Number.MAX_VALUE,
	host:'http://www2.hm.com/',
	_retry:0,
	timeout:12000, //timeout
 });
let time = new Date();
let sigleton = null;

class HM {
	constructor(){
		if(!sigleton){
			sigleton = this;
		}else{
			return sigleton;
		}
	};

	async run(opt = _.cloneDeep(option)){
		await new Consumer(3).push(()=>{
			return new Promise((resolve,reject)=>{
				let req = request(opt,function(err,res){	
					if(err){
						//net failed,retry 3 times
						reject(err);
						if(opt._retry < RETRY){
							opt._retry+=1;
							sigleton.run(opt);
						}else{
							//todo
							//drop req,and log
						}
					}else{
						req = null;
						let r = sigleton.handler( iconv.decode(res.body,'utf-8') );
						// console.log(r);
						//todo database
						resolve(true);
					}
				})
			})
		});
		option.qs['page-size'] += 30;
		if(option.qs['page-size'] <= option.total){
			//call itself,avoid callmaxium
			setTimeout(sigleton.run,0);
		}
	};

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
				// console.log($(el).find('.price').eq(0).text().trim().replace(',','').replace('¥',''));
				let price = Number($(el).find('.price').eq(0).text().trim().replace(',','').replace('¥','').trim());
				res.push({
					href:href,
					name:name,
					img:img,
					price:price,
					sale:-1,
					desc:''
				});
			});
		}catch(e){
			console.log(e)
			// logFile.error('fatal:page changed,selectors have failed: '+e.toString());
		}
		return res;
	};
}

module.exports = HM