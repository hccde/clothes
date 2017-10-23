let cheerio = require('cheerio');
let globalConfig = require('../configure');
let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount = 0;
let request = require('../lib/request');
let currentOffset = -30;

module.exports = {
	types:['ladies_all','men_all','kids_all','home_all'],
	all:{
		url:'http://www2.hm.com/zh_cn/ladies/shop-by-product/view-all.html',
		params:{
			'product-type':'ladies_all',
			'sort':'stock',
			get offset(){
				currentOffset = currentOffset+30;
				return currentOffset;
			},
			'page-size':30
		},
		total:100,
		get currentOffset(){
			return currentOffset;
		},
		host:'http://www2.hm.com/'
	},
	handler(str,type){
		let $ = cheerio.load(str);
		let res = [];
		this.all.total = total = $('.listing-total-count').data().totalCount;
		let host = this.all.host;
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
				desc:'',
				type:type
			});
		});
		warningCount = 0;	
		}catch(e){
			logFile.error('fatal:page changed,selectors have failed: '+e.toString());
			warningCount++;
			if(warningCount>warningLimit){
				request.kill('hm');
				logFile.error('fatal:failed totally,kill hm request queue');
				return -1;
			}
		}

		return res;
	},
	reset(){
		currentOffset = -30;
		warningCount = 0;
	},
	concurrency:10
}