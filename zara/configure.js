let cheerio = require('cheerio');
let globalConfig = require('../configure');
let logFile = globalConfig.logFile;
let warningCount = 0,warningLimit = 20;
let request = require('../lib/request');
let _ = require('lodash');
module.exports = {
	all:{
		url:'https://www.zara.cn/cn/',
		params:{

		},
		urlList:{current:{
			woman:[],
			man:[],
			kid:[]
		},future:{
			woman:[],
			man:[],
			kid:[]
		}},
		urlCol:{},
		handler(str){
			let $ = cheerio.load(str);
			try{
				//current
				let current = $('.menu ul li').first().find('ul').html();
				$(current).each((index,el)=>{
					if(index === 0 || index === 1){
						this.urlList.current.woman.push($(el).find('a').attr('href'));
					}
					if(index === 2){
						this.urlList.current.man.push($(el).find('a').attr('href'));

					}
					if(index == 3){
						this.urlList.current.kid.push($(el).find('a').attr('href'));						
					}
				});

				//future
				let future = $('.menu>ul>li').eq(1).find('ul').html();
				$(future).each((index,el)=>{
					if(index === 0 || index === 1){
						$(el).find('li').each((ind,e)=>{
							this.urlList.future.woman.push($(e).find('a').attr('href'));
						});
					}
					if(index === 2){
						$(el).find('li').each((ind,e)=>{
							this.urlList.future.man.push($(e).find('a').attr('href'));
						});
					}
					if(index == 3||index == 4||index == 5||index == 6){
						$(el).find('li').each((ind,e)=>{
							this.urlList.future.kid.push($(e).find('a').attr('href'));
						});						
					}
				});

				this.urlCol = _.merge(this.urlList.current,this.urlList.future);
				return this.urlCol
			}catch(e){
				logFile.error('fatal error:page have changed selectors have failed '+e.toString());
				warningCount++;
				if(warningLimit < warningCount){
					request.kill('zara');
					logFile('fatal error : kill zara');
				}
			}
		}	
	},
	handler(str,type){
		let $ = cheerio.load(str);
		let goodData = [];
		try{
		$('.product-list').find('li').each((index,el)=>{
			let img = $(el).find('img').attr('src');
			let href = $(el).find('a').attr('href');
			let name = $(el).find('.product-info .name').text();
			let price = $(el).find('.product-info .product-info-item-price .price').html();
			//debug?
			if(price){
				price = $(price).data('price').trim().split('¥').pop().trim();
				goodData.push({
					img:img,
					href:href,
					name:name,
					desc:'',
					type:type,
					price:price
				})
			}else{
				// ignore it
			}
			// console.log(img,href,name,price);
			warningCount = 0;
		})
		}catch(e){
			logFile.error('fatal error '+e.toString());
			warningCount++;
			if(warningCount > warningLimit){
				request.kill('zara');
				return -1;
			}
		}
		return goodData;
	},
	concurrenency:10,
}