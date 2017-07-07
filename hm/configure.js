let cheerio = require('cheerio');
let globalConfig = require('../configure');
let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount = 0;
let request = require('../request');

module.exports = {
	types:['ladies_all'],
	all:{
		url:'http://www2.hm.com/zh_cn/ladies/shop-by-product/view-all.html',
		params:{
			'product-type':'ladies_all',
			'sort':'stock',
			'offset':0,
			'page-size':30
		},
		total:10,
		host:'http://www2.hm.com/'
	},
	handler(str,sex){
		let $ = cheerio.load(str);
		let res = {};
		this.all.total = total = $('.listing-total-count').data();
		try{
		$('.product-item').each(function(index,el){
			let href = $(el).find('a').attr('href');
			let name = $(el).find('a').attr('title');
			let img = $(el).find('img').attr('src');
			let price = Number($(el).find('.price').text().trim().split('¥').pop().trim());
			res.push({
				href:href,
				name:name,
				img:img,
				price:price,
				sale:-1,
				desc:'',
				sex:sex
			});
		});
		warningCount = 0;	
		}catch(e){
			logFile.error('fatal:page changed,selectors have failed: '+e.toString());
			warningCount++;
			if(warningCount>warningLimit){
				request.kill('hm');
				logFile.error('fatal:failed totally,kill hm request queue');
			}
		}

		return res;
	}
}